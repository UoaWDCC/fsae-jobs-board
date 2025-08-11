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

@authenticate('fsae-jwt')
export class JobController {
  constructor(
    @repository(JobAdRepository) public jobAdRepository : JobAdRepository,
    @inject(AuthenticationBindings.CURRENT_USER) private currentUserProfile: UserProfile,
  ) {}

  // TEMPORARY: Remove protection for testing job ads
  // @authorize({
  //   allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  // })
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
            exclude: ['id', 'publisherID'],
          }),
        },
      },
    })
    jobAdData: Omit<JobAd, 'id' | 'publisherID'>,
  ): Promise<JobAd> {
    const jobAd = new JobAd(jobAdData);
    jobAd.publisherID = this.currentUserProfile.id.toString();
    return this.jobAdRepository.create(jobAd);
  }

  // TEMPORARY: Remove protection for testing job ads
  // @authorize({
  //   allowedRoles: [FsaeRole.MEMBER],
  // })
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

  // TEMPORARY: Remove protection for testing job ads
  // @authorize({
  //   allowedRoles: [FsaeRole.MEMBER],
  // })
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
    const jobAd = await this.jobAdRepository.findById(id, filter);
    if (!jobAd) {
        throw new HttpErrors.NotFound(`Job ad with id ${id} not found`);
    }
    return jobAd;
  }

  // Only alumni and sponsors can update jobs
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
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
    if (existingjobAd.publisherID !== this.currentUserProfile.id.toString()) {
      throw new HttpErrors.Unauthorized('You are not authorized to update this job posting');
    }
    await this.jobAdRepository.updateById(id, jobAd);
  }

  // Only alumni and sponsors can delete jobs
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @del('/job/{id}')
  @response(204, {
    description: 'Deleting job postings by ID',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const existingJobAd = await this.jobAdRepository.findById(id);
    if (existingJobAd.publisherID.toString() !== this.currentUserProfile.id.toString()) {
      throw new HttpErrors.Unauthorized('You are not authorized to delete this job posting');
    }
    await this.jobAdRepository.deleteById(id);
  }
}