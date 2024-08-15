import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, del, requestBody, response, Request, RestBindings} from '@loopback/rest';
import {inject} from '@loopback/core';
import {JwtService} from '../services';
import {JobAd} from '../models';
import {JobAdRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { HttpErrors } from '@loopback/rest';
import {FsaeRole, Member, Alumni, Sponsor} from '../models';

@authenticate('fsae-jwt')
export class JobController {
  constructor(
    @repository(JobAdRepository) public jobAdRepository : JobAdRepository,
  ) {}


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
            exclude: ['id'],
          }),
        },
      },
    })
    jobAd: Omit<JobAd, 'id'>,
  ): Promise<JobAd> {
    return this.jobAdRepository.create(jobAd);
  }


  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
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
    allowedRoles: [FsaeRole.MEMBER],
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
    const jobAd = await this.jobAdRepository.findById(id, filter);
    if (!jobAd) {
        throw new HttpErrors.NotFound(`Job ad with id ${id} not found`);
    }
    return jobAd;
  }


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
    //const user = await this.authenticate();
    const existingjobAd = await this.jobAdRepository.findById(id);
    //if (existingjobAd.publisherID !== user.id) {
      //throw new Error('You are not authorized to update this job posting');
    //}
    await this.jobAdRepository.updateById(id, jobAd);
  }


  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @del('/job/{id}')
  @response(204, {
    description: 'Deleting job postings by ID',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    //const user = await this.authenticate();
    const existingJobAd = await this.jobAdRepository.findById(id);
    //if (existingJobAd.publisherID !== user.id) {
      //throw new Error('You are not authorized to delete this job posting');
    //}
    await this.jobAdRepository.deleteById(id);
  }
}
