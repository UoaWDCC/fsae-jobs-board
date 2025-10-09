import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, del, requestBody, response} from '@loopback/rest';
import {inject} from '@loopback/core';
import {JobAd} from '../models';
import {JobAdRepository} from '../repositories';
import {UserProfile} from '@loopback/security';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {HttpErrors} from '@loopback/rest';
import {FsaeRole} from '../models';
import { AdminLogRepository } from '../repositories/admin.logs.repository';
import { AdminLogService } from '../services/admin-log.service';
import {service} from '@loopback/core';
import { ownerOnly } from '../decorators/owner-only.decorator';

@authenticate('fsae-jwt')
export class JobController {
  constructor(
    @repository(JobAdRepository) public jobAdRepository : JobAdRepository,
    @inject(AuthenticationBindings.CURRENT_USER) private currentUserProfile: UserProfile,
    @service(AdminLogService) private adminLogService: AdminLogService
  ) {
    if(!this.jobAdRepository) {
      throw new HttpErrors.InternalServerError('JobAdRepository is not available');
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @post('/job')
  @response(200, {
    description: 'Creating a new job ad',
    content: {'application/json': {schema: getModelSchemaRef(JobAd)}},
  })
  async createJobAd(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(JobAd, {
            title: 'NewJobAd',
            exclude: ['id', 'publisherID', 'isPostedByAlumni'],
          }),
        },
      },
    })
    jobAdData: Omit<JobAd, 'id' | 'publisherID' | 'isPostedByAlumni'>,
  ): Promise<JobAd> {
    const jobAd = new JobAd(jobAdData);
    jobAd.publisherID = this.currentUserProfile.id.toString();

    // Check if current poster is an alumni
    const userRole = this.currentUserProfile.role || "";
    console.log('Current user role:', userRole);
    jobAd.isPostedByAlumni = userRole.includes(FsaeRole.ALUMNI);
    console.log(`isPostedByAlumni set to: ${jobAd.isPostedByAlumni}`);
    
    return this.jobAdRepository.create(jobAd);
  }

  // TEMPORARY: Remove protection for testing job ads
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ALUMNI, FsaeRole.SPONSOR, FsaeRole.ADMIN],
  })
  @get('/job')
  @response(200, {
    description: 'Fetching a list of all job postings',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(JobAd, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(JobAd) filter?: Filter<JobAd>,
  ): Promise<JobAd[]> {
    return this.jobAdRepository.find(filter);
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ALUMNI, FsaeRole.SPONSOR, FsaeRole.ADMIN],
  })
  @get('/job/{id}')
  @response(200, {
    description: 'Retrieving job details by ID',
    content: {
      'application/json': {
        schema: getModelSchemaRef(JobAd, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(JobAd, {exclude: 'where'}) filter?: FilterExcludingWhere<JobAd>
  ): Promise<JobAd> {
    return this.jobAdRepository.findById(id, filter);
  }

  // TEMPORARY: Remove protection for testing job ads
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @ownerOnly({
    ownerField: 'publisherID',
    idIndex: 0,
    repoKey: 'jobAdRepository',
  })
  @patch('/job/{id}')
  @response(204, {
    description: 'Updating job details by ID',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(JobAd, {partial: true}),
        },
      },
    })
    jobAd: JobAd,
  ): Promise<void> {
    const existingjobAd = await this.jobAdRepository.findById(id);

    // required since we risk overwriting the publisherID
    if ('publisherID' in jobAd) {
      jobAd.publisherID = existingjobAd.publisherID;
    }

    await this.jobAdRepository.updateById(id, jobAd);
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR, FsaeRole.ADMIN],
  })
  @ownerOnly({
    ownerField: 'publisherID',
    idIndex: 0,
    repoKey: 'jobAdRepository',
  })
  @del('/job/{id}')
  @response(204, {
    description: 'Deleting job postings by ID',
  })
  async deleteById(
    @param.path.string('id') id: string,
    @requestBody({
      required: false,
      description: 'Optional reason for admin deletion',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              reason: {type: 'string'},
            },
          },
        },
      },
    })
    body?: {reason?: string},
  ): Promise<void> {
    const job = await this.jobAdRepository.findById(id);

    const currentUserId = this.currentUserProfile.id.toString();
    const isAdmin = this.currentUserProfile.roles?.includes(FsaeRole.ADMIN);

    const isOwner = job.publisherID.toString() === currentUserId;

    if (!isOwner && !isAdmin) {
      throw new HttpErrors.Unauthorized('You are not authorized to delete this job posting');
    }

    await this.jobAdRepository.deleteById(id);

    if (isAdmin) {
      await this.adminLogService.createAdminLog(
        currentUserId,
        {
          message: 'Job post deleted by admin',
          jobId: id,
          jobTitle: job.title,
          publisherId: job.publisherID,
          ...(body?.reason ? {reason: body.reason} : {}),
        },
      );
    }
  }
}