import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
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
import {FsaeRole, Member} from '../models';
import {MemberRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import {inject} from '@loopback/core';
import {Request, RestBindings, Response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import multer from 'multer';
import { s3Service, s3ServiceInstance } from '../services/s3.service';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 16 * 1024 * 1024 }, // 16MB max size
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  }
});

@authenticate('fsae-jwt')
export class MemberController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
    @repository(MemberRepository) public memberRepository: MemberRepository,
  ) {}

  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.SPONSOR, FsaeRole.ALUMNI],
  })
  @get('/user/member/{id}')
  @response(200, {
    description: 'Member model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Member, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Member, {exclude: 'where'}) filter?: FilterExcludingWhere<Member>
  ): Promise<Member | null> {
    return this.memberRepository.findById(id, filter);
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
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
          schema: getModelSchemaRef(Member, {partial: true, exclude: ['cvUrl']}),
        },
      },
    })
    member: Member,
  ): Promise<void> {
    await this.memberRepository.updateById(id, member);
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
  ): Promise<{success: boolean; message: string; fileName?: string; size?: number}> {
    console.log('Injected user:', this.currentUserProfile);
    return new Promise((resolve, reject) => {
      upload.single('cv')(this.req, response, async (err) => {
        if (err) {
          resolve({
            success: false,
            message: err.message || 'Upload failed',
          });
          return;
        }

        const file = (this.req as any).file;
        if (!file) {
          console.error('No file received');
          resolve({
            success: false,
            message: 'No file uploaded',
          });
          return;
        }

        console.log('File received:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          bufferLength: file.buffer?.length,
        });

        const memberId = this.currentUserProfile?.id;
        if (!memberId) {
          console.log('No member ID found in user profile');
          resolve({
            success: false,
            message: 'User not authenticated',
          });
          return;
        }

        console.log('Member ID:', memberId);

        try {
          const existingMember = await this.memberRepository.findById(memberId);
          // If user has existing CV, delete the existing file from S3
          if (existingMember.cvS3Key) {
            console.log(`Deleting existing CV file: ${existingMember.cvS3Key}`);
            try {
              await s3ServiceInstance.deleteFile(existingMember.cvS3Key);
              console.log('Successfully deleted existing CV file');
            } catch (err) {
              console.error('Error deleting existing CV file:', err);
            }
          }

          const { key, url } = await s3ServiceInstance.uploadFile(
            file.buffer, 
            file.originalname, 
            file.mimetype
          );
          
          // Store S3 Url in MongoDB
          await this.memberRepository.updateById(memberId, {
            cvS3Key: key,
            cvUrl: url,
            cvFileName: file.originalname,
            cvMimeType: file.mimetype,
            cvSize: file.size,
            cvUploadedAt: new Date(),
            hasCV: true,
          });
          
          resolve({
            success: true,
            message: 'CV uploaded successfully',
            fileName: file.originalname,
            size: file.size,
          });
        } catch (error) {
          console.error('S3 upload error:', error);
          resolve({
            success: false,
            message: 'Failed to upload CV to storage',
          });
        }

      });
    });
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN],
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
  @response(404, {
    description: 'CV not found',
  })
  async downloadCV(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<{url: string; fileName: string; mimeType: string, object: object} | void> {
    try {
      const member = await this.memberRepository.findById(id);
      
      if (!member.cvUrl || !member.cvS3Key || !member.cvFileName) {
        response.status(404).json({ message: 'CV not found' });
        return;
      }
      const s3Object = await s3ServiceInstance.getObject(member.cvS3Key);
      const fileName =
        (s3Object.Metadata && s3Object.Metadata.originalfilename) ||
        member.cvFileName ||
        'cvFile';
      
      // convert S3 stream to Buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of s3Object.Body as any) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      
      response.setHeader('Content-Type', member.cvMimeType);
      response.set('Content-Disposition', `inline; filename="${fileName}"`);
      response.setHeader(
        'Content-Disposition',
        `inline; filename="${member.cvFileName}"`,
      );

      response.send(buffer);
      
    } catch (error) {
      console.error('CV download error:', error);
      response.status(500).json({ message: 'Failed to download CV' });
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
  })
  @patch('/user/member/{id}/delete-cv')
  @response(204, {
    description: 'CV deleted successfully',
  })
  async deleteCV(
    @param.path.string('id') id: string,
  ): Promise<void> {
    const member = await this.memberRepository.findById(id);
    
    if (member && member.cvS3Key) {
      await s3ServiceInstance.deleteFile(member.cvS3Key);
      await this.memberRepository.updateById(id, {
        cvUrl: '',
        cvS3Key: '',
        cvFileName: '',
        cvMimeType: '',
        cvSize: 0,
        cvUploadedAt: new Date(),
        hasCV: false,
      });
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @del('/user/member/{id}')
  @response(204, {
    description: 'Member DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.memberRepository.deleteById(id);
  }
}
