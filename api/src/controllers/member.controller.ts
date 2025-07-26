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
} from '@loopback/rest';
import {FsaeRole, Member} from '../models';
import {MemberRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import {inject} from '@loopback/core';
import {Request, RestBindings, Response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import multer from 'multer';

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
    allowedRoles: [FsaeRole.MEMBER],
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
          schema: getModelSchemaRef(Member, {partial: true}),
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

        const binaryData = file.buffer;

        try {
          await this.memberRepository.updateById(memberId, {
            cvData: binaryData,
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
          console.error('CV upload error:', error);
          resolve({
            success: false,
            message: 'Failed to save CV data',
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
      'application/pdf': {
        schema: {type: 'string', format: 'binary'},
      },
      'application/msword': {
        schema: {type: 'string', format: 'binary'},
      },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        schema: {type: 'string', format: 'binary'},
      },
    },
  })
  @response(404, {
    description: 'CV not found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {type: 'string'},
          },
        },
      },
    },
  })
  async downloadCV(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    try {
      const member = await this.memberRepository.findById(id);
      
      if (!member.cvData || !member.cvFileName) {
        response.status(404).json({ message: 'CV not found' });
        return;
      }

      const cvBuffer = member.cvData as unknown as Buffer;
      
      response.setHeader('Content-Type', member.cvMimeType || 'application/pdf');
      response.setHeader('Content-Disposition', `inline; filename="${member.cvFileName}"`);
      response.setHeader('Content-Length', cvBuffer.length.toString());
      
      response.send(cvBuffer);
      
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
    
    if (member) {
      await this.memberRepository.updateById(id, {
        cvData: '',
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
