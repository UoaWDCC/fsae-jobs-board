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

  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
  })
  @ownerOnly({
    ownerField: 'memberId',
  })
  @get('/api/members/{memberId}/submissions')
  @response(200, {
    description: 'Get member application submission history',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            submissions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {type: 'string'},
                  job_id: {type: 'string'},
                  job_title: {type: 'string'},
                  company_name: {type: 'string'},
                  submission_date: {type: 'string'},
                  status: {type: 'string'},
                },
              },
            },
            total_count: {type: 'number'},
          },
        },
      },
    },
  })
  async getMemberSubmissions(
    @param.path.string('memberId') memberId: string,
  ): Promise<{
    submissions: Array<{
      id: string;
      job_id: string;
      job_title: string;
      company_name: string;
      submission_date: string;
      status: string;
    }>;
    total_count: number;
  }> {
    try {
      // Get all submissions for this member
      const submissions = await this.tallySubmissionRepository.find({
        where: {memberId: memberId},
        order: ['submittedAt DESC'],
      });

      // Build response with job details
      const submissionDetails = await Promise.all(
        submissions.map(async (submission) => {
          // Get form to find job ID
          const form = await this.tallyFormRepository.findById(submission.formId);

          // Get job details
          const job = await this.jobAdRepository.findById(form.jobId);

          return {
            id: submission.id!,
            job_id: form.jobId,
            job_title: job.title,
            company_name: job.specialisation || 'Unknown',
            submission_date: submission.submittedAt.toISOString(),
            status: submission.status,
          };
        }),
      );

      return {
        submissions: submissionDetails,
        total_count: submissionDetails.length,
      };
    } catch (error) {
      console.error('Error fetching member submissions:', error);
      throw new HttpErrors.InternalServerError('Failed to fetch submissions');
    }
  }

}
