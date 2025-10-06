import {AnyObject, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {FsaeRole} from '../models';
import {MemberRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {Request, RestBindings, Response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import multer from 'multer';
import {s3Service, s3ServiceInstance} from '../services/s3.service';
import {
  MemberProfileDto,
  MemberProfileDtoFields,
} from '../dtos/member-profile.dto';
import {ownerOnly} from '../decorators/owner-only.decorator';
import {Notification} from '../models/notification.model';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {fileSize: 16 * 1024 * 1024}, // 16MB max size
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
});

@authenticate('fsae-jwt')
export class MemberController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
    @repository(MemberRepository) public memberRepository: MemberRepository,
  ) {}

  @authorize({
    allowedRoles: [
      FsaeRole.MEMBER,
      FsaeRole.SPONSOR,
      FsaeRole.ALUMNI,
      FsaeRole.ADMIN,
    ],
  })
  @get('/user/member/{id}')
  @response(200, {
    description: 'Member model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MemberProfileDto, {includeRelations: true}),
      },
    },
  })
  async fetchUserProfile(
    @param.path.string('id') id: string,
  ): Promise<MemberProfileDto | null> {
    const result = await this.memberRepository.findById(id, {
      fields: MemberProfileDtoFields,
    });
    return result as MemberProfileDto;
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @patch('/user/member/{id}')
  @response(204, {
    description: 'Member PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          // schema: getModelSchemaRef(Member, {partial: true}),
          schema: getModelSchemaRef(MemberProfileDto, {partial: true}),
        },
      },
    })
    memberDto: Partial<MemberProfileDto>,
  ): Promise<void> {
    await this.memberRepository.updateById(id, memberDto);
  }

  private async handleUpload(
    fileField: string, // "avatar" or "cv" or "banner"
    memberField: 'avatarS3Key' | 'cvS3Key' | 'bannerS3Key',
    response: Response,
    deleteExisting: boolean = true,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      upload.single(fileField)(this.req, response, async err => {
        if (err) {
          resolve({success: false, message: err.message || 'Upload failed'});
          return;
        }
        const file = (this.req as any).file;
        if (!file) {
          resolve({success: false, message: 'No file uploaded'});
          return;
        }

        const memberId = this.currentUserProfile?.id;
        if (!memberId) {
          resolve({success: false, message: 'User not authenticated'});
          return;
        }

        try {
          const existingMember = await this.memberRepository.findById(memberId);
          // If user has existing file, delete the existing file from S3
          if (deleteExisting && existingMember[memberField]) {
            console.log(
              `Deleting existing file: ${existingMember[memberField]}`,
            );
            try {
              await s3ServiceInstance.deleteFile(existingMember[memberField]);
              console.log('Successfully deleted existing file');
            } catch (err) {
              console.error('Error deleting existing file:', err);
            }
          }
          const {key, url} = await s3ServiceInstance.uploadFile(
            file.buffer,
            file.originalname,
            file.mimetype,
          );

          // Store S3 Url in MongoDB
          await this.memberRepository.updateById(memberId, {
            [memberField]: key,
            ...(fileField === 'cv' ? {hasCV: true} : {}),
          });

          resolve({
            success: true,
            message: `${fileField.toUpperCase()} uploaded successfully`,
            key,
            url,
            metadata: {
              filename: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            },
          });
        } catch (error) {
          console.error('S3 upload error:', error);
          resolve({
            success: false,
            message: `Failed to upload ${fileField.toUpperCase()} to S3`,
          });
        }
      });
    });
  }

  private async handleViewFile(
    memberId: string,
    memberField: 'cvS3Key' | 'avatarS3Key' | 'bannerS3Key',
    response: Response,
    inline: boolean = true,
  ) {
    const member = await this.memberRepository.findById(memberId);
    const s3Key = (member as any)[memberField];

    if (!s3Key) {
      response.status(404).json({message: 'File not found'});
      return;
    }

    try {
      const s3Object = await s3ServiceInstance.getObject(s3Key);
      const contentType = s3Object.ContentType ?? 'application/octet-stream';
      const fileName =
        (s3Object.Metadata && s3Object.Metadata.originalfilename) || 'file';

      // convert S3 stream to Buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of s3Object.Body as any) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      response.setHeader('Content-Type', contentType);
      response.setHeader(
        'Content-Disposition',
        `${inline ? 'inline' : 'attachment'}; filename="${fileName}"`,
      );
      response.send(buffer);
    } catch (err) {
      console.error('File view/download error:', err);
      response.status(500).json({message: 'Failed to fetch file'});
    }
  }

  private async handleDeleteFile(
    memberId: string,
    memberField: 'cvS3Key' | 'avatarS3Key' | 'bannerS3Key',
    deleteFlag?: 'hasCV', // only needed for CV
  ) {
    const member = await this.memberRepository.findById(memberId);
    const s3Key = (member as any)[memberField];

    if (s3Key) {
      await s3ServiceInstance.deleteFile(s3Key);

      const updateData: any = {[memberField]: ''};
      if (deleteFlag) {
        updateData[deleteFlag] = false;
      }

      await this.memberRepository.updateById(memberId, updateData);
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
  })
  @post('/user/member/upload-cv')
  @response(200, {
    description: 'CV uploaded successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {type: 'boolean'},
            message: {type: 'string'},
            fileName: {type: 'string'},
            size: {type: 'number'},
          },
        },
      },
    },
  })
  async uploadCV(
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    return this.handleUpload('cv', 'cvS3Key', response, true);
  }

  @authorize({
    allowedRoles: [
      FsaeRole.MEMBER,
      FsaeRole.ADMIN,
      FsaeRole.ALUMNI,
      FsaeRole.SPONSOR,
    ],
  })
  @authenticate('fsae-jwt')
  @get('/user/member/{id}/cv')
  @response(200, {
    description: 'Return member CV file',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            url: {type: 'string'},
            fileName: {type: 'string'},
            mimeType: {type: 'string'},
          },
        },
      },
    },
  })
  @response(404, {description: 'CV not found'})
  async downloadCV(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    return this.handleViewFile(id, 'cvS3Key', response, true);
  }

  @authorize({allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN]})
  @ownerOnly({ownerField: 'id'})
  @patch('/user/member/{id}/delete-cv')
  @response(204, {description: 'CV deleted successfully'})
  async deleteCV(@param.path.string('id') id: string) {
    return this.handleDeleteFile(id, 'cvS3Key', 'hasCV');
  }

  @post('user/member/{id}/upload-avatar')
  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.MEMBER]})
  @response(200, {description: 'Avatar uploaded successfully'})
  async uploadAvatar(@inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.handleUpload('avatar', 'avatarS3Key', response);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [
      FsaeRole.MEMBER,
      FsaeRole.ADMIN,
      FsaeRole.ALUMNI,
      FsaeRole.SPONSOR,
    ],
  })
  @get('/user/member/{id}/avatar')
  async viewAvatar(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    return this.handleViewFile(id, 'avatarS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN],
  })
  @patch('/user/member/{id}/delete-avatar')
  async deleteAvatar(@param.path.string('id') id: string) {
    return this.handleDeleteFile(id, 'avatarS3Key');
  }

  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.MEMBER]})
  @post('user/member/{id}/upload-banner')
  @response(200, {description: 'Banner uploaded successfully'})
  async uploadBanner(@inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.handleUpload('banner', 'bannerS3Key', response);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [
      FsaeRole.MEMBER,
      FsaeRole.ADMIN,
      FsaeRole.ALUMNI,
      FsaeRole.SPONSOR,
    ],
  })
  @get('/user/member/{id}/banner')
  async viewBanner(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    return this.handleViewFile(id, 'bannerS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN],
  })
  @patch('/user/member/{id}/delete-banner')
  async deleteBanner(@param.path.string('id') id: string) {
    return this.handleDeleteFile(id, 'bannerS3Key');
  }

  @authorize({allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN]})
  @ownerOnly({ownerField: 'id'})
  @del('/user/member/{id}')
  @response(204, {description: 'Member DELETE success'})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.memberRepository.deleteById(id);
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @patch('/user/member/notifications/{id}/read-all')
  @response(204, {
    description: 'Notifications marked as read',
  })
  async markAllNotificationsAsRead(
    @param.path.string('id') id: string,
  ): Promise<void> {
    await this.memberRepository.updateById(id, {
      $set: {
        'notifications.$[].read': true,
      },
    } as AnyObject);
  }

  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.MEMBER]})
  @ownerOnly({ownerField: 'id'})
  @get('/user/member/notifications/{id}')
  @response(200, {
    description: 'All notifications for user',
  })
  async getNotifications(@param.path.string('id') id: string): Promise<{
    notifications: Notification[];
    hasUnread: boolean;
    unreadCount: number;
  }> {
    const user = await this.memberRepository.findById(id, {
      fields: {notifications: true, id: true},
    });

    const notifications = (user.notifications ?? []).sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );

    const unreadCount = notifications.reduce((n, x) => n + (x.read ? 0 : 1), 0);

    return {
      notifications,
      hasUnread: unreadCount > 0,
      unreadCount,
    };
  }
}
