import {Filter, repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
  post,
  Response,
  RestBindings,
  Request,
} from '@loopback/rest';
import {Alumni, FsaeRole} from '../models';
import {
  AlumniProfileDto,
  AlumniProfileDtoFields,
} from '../dtos/alumni-profile.dto';
import {AlumniRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {ownerOnly} from '../decorators/owner-only.decorator';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {s3Service, s3ServiceInstance} from '../services/s3.service';
import multer from 'multer';

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
export class AlumniController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(AlumniRepository) public alumniRepository: AlumniRepository,
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
  ) {}

  @authorize({
    allowedRoles: [
      FsaeRole.ALUMNI,
      FsaeRole.MEMBER,
      FsaeRole.SPONSOR,
      FsaeRole.ADMIN,
    ],
  })
  @get('/user/alumni')
  @response(200, {
    description: 'Array of Alumni model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Alumni, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Alumni) filter?: Filter<Alumni>): Promise<Alumni[]> {
    return this.alumniRepository.find(filter);
  }

  @authorize({
    allowedRoles: [
      FsaeRole.ALUMNI,
      FsaeRole.MEMBER,
      FsaeRole.SPONSOR,
      FsaeRole.ADMIN,
    ],
  })
  @get('/user/alumni/{id}')
  @response(200, {
    description: 'Alumni model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AlumniProfileDto, {
          title: 'Alumni Profile',
        }),
      },
    },
  })
  async getAlumniProfile(
    @param.path.string('id') id: string,
  ): Promise<AlumniProfileDto> {
    const result = await this.alumniRepository.findById(id, {
      fields: AlumniProfileDtoFields,
    });
    return result as AlumniProfileDto;
  }

  @patch('/user/alumni/{id}')
  @response(204, {
    description: 'Alumni PATCH success',
  })
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  async updateAlumniProfile(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AlumniProfileDto, {partial: true}),
        },
      },
    })
    alumniDto: Partial<AlumniProfileDto>,
  ): Promise<void> {
    await this.alumniRepository.updateById(id, alumniDto);
  }

  @authorize({
    allowedRoles: [FsaeRole.ADMIN, FsaeRole.ALUMNI],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @del('/user/alumni/{id}')
  @response(204, {
    description: 'Alumni DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.alumniRepository.deleteById(id);
  }

  //AVATAR AND BANNER STUFF
  @post('user/alumni/{id}/upload-avatar')
  @ownerOnly({
    ownerField: 'id',
  })
  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ALUMNI]})
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
  @get('/user/alumni/{id}/avatar')
  async viewAvatar(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    return this.handleViewFile(id, 'avatarS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @ownerOnly({
    ownerField: 'id',
  })
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.ADMIN],
  })
  @patch('/user/alumni/{id}/delete-avatar')
  async deleteAvatar(@param.path.string('id') id: string) {
    return this.handleDeleteFile(id, 'avatarS3Key');
  }

  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ALUMNI]})
  @ownerOnly({
    ownerField: 'id',
  })
  @post('user/alumni/{id}/upload-banner')
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
  @get('/user/alumni/{id}/banner')
  async viewBanner(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    return this.handleViewFile(id, 'bannerS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @ownerOnly({
    ownerField: 'id',
  })
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.ADMIN],
  })
  @patch('/user/alumni/{id}/delete-banner')
  async deleteBanner(@param.path.string('id') id: string) {
    return this.handleDeleteFile(id, 'bannerS3Key');
  }

  private async handleUpload(
    fileField: string, // "avatar" or "banner"
    alumniField: 'avatarS3Key' | 'bannerS3Key',
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

        const alumniId = this.currentUserProfile?.id;
        if (!alumniId) {
          resolve({success: false, message: 'User not authenticated'});
          return;
        }

        try {
          const existingAlumni = await this.alumniRepository.findById(alumniId);
          // If user has existing file, delete the existing file from S3
          if (deleteExisting && existingAlumni[alumniField]) {
            console.log(
              `Deleting existing file: ${existingAlumni[alumniField]}`,
            );
            try {
              await s3ServiceInstance.deleteFile(existingAlumni[alumniField]);
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
          await this.alumniRepository.updateById(alumniId, {
            [alumniField]: key,
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
    alumniId: string,
    alumniField: 'avatarS3Key' | 'bannerS3Key',
    response: Response,
    inline: boolean = true,
  ) {
    const alumni = await this.alumniRepository.findById(alumniId);
    const s3Key = (alumni as any)[alumniField];

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
    alumniId: string,
    alumniField: 'avatarS3Key' | 'bannerS3Key',
    deleteFlag?: 'hasCV', // only needed for CV
  ) {
    const alumni = await this.alumniRepository.findById(alumniId);
    const s3Key = (alumni as any)[alumniField];

    if (s3Key) {
      await s3ServiceInstance.deleteFile(s3Key);

      const updateData: any = {[alumniField]: ''};
      if (deleteFlag) {
        updateData[deleteFlag] = false;
      }

      await this.alumniRepository.updateById(alumniId, updateData);
    }
  }
}
