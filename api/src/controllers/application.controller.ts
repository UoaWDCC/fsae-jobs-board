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
  HttpErrors
} from '@loopback/rest';
import {Application} from '../models';
import {ApplicationRepository, JobAdRepository, MemberRepository} from '../repositories';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import {FsaeRole} from '../models';

export class ApplicationController {
  constructor(
    @repository(ApplicationRepository)
    public applicationRepository: ApplicationRepository,
    @repository(JobAdRepository)
    public jobAdRepository: JobAdRepository,
    @repository(MemberRepository)
    public memberRepository: MemberRepository,
  ) {}

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
  })
  @post('/application') //auto assign date on server side?
  @response(200, {
    description: 'Application model instance',
    content: {'application/json': {schema: getModelSchemaRef(Application)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {
            title: 'NewApplication',
            exclude: ['id', 'memberID'],
          }),
        },
      },
    })
    application: Omit<Application, 'id' | 'memberID'>,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<Application> {
    try {
      // Input validation
      if (!application.jobID || typeof application.jobID !== 'string' || application.jobID.trim() === '') {
        throw new HttpErrors.BadRequest('jobID is required and must be a non-empty string.');
      }
      if (!application.status || typeof application.status !== 'string' || application.status.trim() === '') {
        throw new HttpErrors.BadRequest('status is required and must be a non-empty string.');
      }
      if (!application.applicationDate || typeof application.applicationDate !== 'string' || application.applicationDate.trim() === '') {
        throw new HttpErrors.BadRequest('applicationDate is required and must be a non-empty string.');
      }


      const newApplication = {
        ...application,
        memberID: currentUser.id,
      };


      const existing = await this.applicationRepository.findOne({
        where: {
          memberID: newApplication.memberID,
          jobID: newApplication.jobID,
        },
      });
      if (existing) {
        throw new HttpErrors.Conflict('You have already applied to this job.');
      }


      try {
        await this.jobAdRepository.findById(newApplication.jobID);
      } catch {
        throw new HttpErrors.NotFound('The specified job does not exist.');
      }


      try {
        await this.memberRepository.findById(newApplication.memberID);
      } catch {
        throw new HttpErrors.NotFound('The specified member does not exist.');
      }


      return await this.applicationRepository.create(newApplication);
    } catch (err) {
      if (err instanceof HttpErrors.HttpError) throw err;
      throw new HttpErrors.InternalServerError('Failed to create application');
    }
  }

  @get('/application')
  @response(200, {
    description: 'Array of Application model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Application, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Application) filter?: Filter<Application>,
  ): Promise<Application[]> {
    return this.applicationRepository.find(filter);
  }

  @get('/application/{id}')
  @response(200, {
    description: 'Application model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Application, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Application, {exclude: 'where'}) filter?: FilterExcludingWhere<Application>
  ): Promise<Application> {
    return this.applicationRepository.findById(id, filter);
  }

  @patch('/application/{id}')
  @response(204, {
    description: 'Application PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {partial: true}),
        },
      },
    })
    application: Application,
  ): Promise<void> {
    await this.applicationRepository.updateById(id, application);
  }

  @del('/application/{id}')
  @response(204, {
    description: 'Application DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.applicationRepository.deleteById(id);
  }
}
