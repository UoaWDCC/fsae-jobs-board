import {
  repository,
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
import {FsaeRole} from '../models';
import {
  MemberRepository,
  TallySubmissionRepository,
  TallyFormRepository,
  JobAdRepository,
} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import {inject} from '@loopback/core';
import {Request, RestBindings, Response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import multer from 'multer';
import { s3Service, s3ServiceInstance } from '../services/s3.service';
import { MemberProfileDto, MemberProfileDtoFields } from '../dtos/member-profile.dto';
import { ownerOnly } from '../decorators/owner-only.decorator';
import { validateEmail } from '../utils/validateEmail';
import { FileHandlerService } from '../services/file-handling.service';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 16 * 1024 * 1024 }, // 16MB max size
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
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

  private fileHandler: FileHandlerService;

  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
    @repository(MemberRepository) public memberRepository: MemberRepository,
    @repository(TallySubmissionRepository)
    public tallySubmissionRepository: TallySubmissionRepository,
    @repository(TallyFormRepository)
    public tallyFormRepository: TallyFormRepository,
    @repository(JobAdRepository)
    public jobAdRepository: JobAdRepository,
  ) {
    this.fileHandler = new FileHandlerService(this.memberRepository);
  }

  @authorize({
    allowedRoles: [FsaeRole.ADMIN, FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @get('/user/member')
  @response(200, {
    description: 'Get member list (flat, filtered, selected fields only)',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {type: 'string'},
              firstName: {type: 'string'},
              lastName: {type: 'string'},
              lookingFor: {type: 'string'},
              subGroup: {type: 'string'},
              avatarURL: {type: 'string'},
            },
          },
        },
      },
    },
  })
  async fetchUserList(
    @param.query.string('lookingFor') lookingFor?: string | string[],
    @param.query.string('subGroup') subGroup?: string | string[],
  ) {
    const where: any = {};

    const normalize = (v?: string | string[]): string[] => {
      if (!v) return [];
      if (Array.isArray(v)) return v.map(s => String(s).trim()).filter(Boolean);
      return String(v).split(',').map(s => s.trim()).filter(Boolean);
    };

    const lookingForArr = normalize(lookingFor);
    const subGroupArr = normalize(subGroup);

    if (lookingForArr.length) where.lookingFor = {inq: lookingForArr};
    if (subGroupArr.length) where.subGroup = {inq: subGroupArr};

    const members = await this.memberRepository.find({
      where,
      order: ['id DESC'],
      fields: {
        id: true,
        firstName: true,
        lastName: true,
        lookingFor: true,
        subGroup: true,
        avatarURL: true,
      },
    });

    return members;
  }


  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.SPONSOR, FsaeRole.ALUMNI, FsaeRole.ADMIN],
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
    if ('email' in memberDto) {
      console.log('Validating email:', memberDto.email);
      const { valid, message } = validateEmail(memberDto);
      if (!valid) {
        console.log('Email validation failed:', message);
        throw new HttpErrors.BadRequest(message);
      }
      console.log('Email validation passed');
    }
    await this.memberRepository.updateById(id, memberDto);
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
  async uploadCV(@inject(RestBindings.Http.RESPONSE) response: Response): Promise<any> {
    return this.fileHandler.handleUpload(this.memberRepository, this.currentUserProfile, this.req, 'cv', 'cvS3Key', response, true);
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN, FsaeRole.ALUMNI, FsaeRole.SPONSOR],
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
  @response(404, { description: 'CV not found' })
  async downloadCV(@param.path.string('id') id: string, @inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleViewFile(this.memberRepository, id, 'cvS3Key', response, true);
  }

  @authorize({ allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN] })
  @ownerOnly({ ownerField: 'id' })
  @patch('/user/member/{id}/delete-cv')
  @response(204, { description: 'CV deleted successfully' })
  async deleteCV(@param.path.string('id') id: string) {
    return this.fileHandler.handleDeleteFile(this.memberRepository, id, 'cvS3Key', 'hasCV');
  }

  @post('user/member/{id}/upload-avatar')
  @authenticate('fsae-jwt')
  @authorize({ allowedRoles: [FsaeRole.MEMBER] })
  @response(200, { description: 'Avatar uploaded successfully' })
  async uploadAvatar(@inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleUpload(this.memberRepository, this.currentUserProfile, this.req, 'avatar', 'avatarS3Key', response);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN, FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @get('/user/member/{id}/avatar')
  async viewAvatar(@param.path.string('id') id: string, @inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleViewFile(this.memberRepository, id, 'avatarS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN],
  })
  @patch('/user/member/{id}/delete-avatar')
  async deleteAvatar(@param.path.string('id') id: string) {
    return this.fileHandler.handleDeleteFile(this.memberRepository, id, 'avatarS3Key');
  }

  @authenticate('fsae-jwt')
  @authorize({ allowedRoles: [FsaeRole.MEMBER] })
  @post('user/member/{id}/upload-banner')
  @response(200, { description: 'Banner uploaded successfully' })
  async uploadBanner(@inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleUpload(this.memberRepository, this.currentUserProfile, this.req, 'banner', 'bannerS3Key', response);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN, FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @get('/user/member/{id}/banner')
  async viewBanner(@param.path.string('id') id: string, @inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleViewFile(this.memberRepository, id, 'bannerS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN],
  })
  @patch('/user/member/{id}/delete-banner')
  async deleteBanner(@param.path.string('id') id: string) {
    return this.fileHandler.handleDeleteFile(this.memberRepository, id, 'bannerS3Key');
  }  

  @authorize({ allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN] })
  @ownerOnly({ ownerField: 'id' })
  @del('/user/member/{id}')
  @response(204, { description: 'Member DELETE success' })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.memberRepository.deleteById(id);
  }

}
