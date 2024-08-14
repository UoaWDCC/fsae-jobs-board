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
import {Application, FsaeRole} from '../models';
import {ApplicationRepository} from '../repositories';
import { authorize } from '@loopback/authorization';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import {UserProfile} from '@loopback/security';

@authenticate('fsae-jwt')
export class ApplicationController {
  constructor(
    @repository(ApplicationRepository)
    public applicationRepository : ApplicationRepository,
  ) {}

  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
  })
  @post('/application')
  @response(200, {
    description: 'Application model instance',
    content: {'application/json': {schema: getModelSchemaRef(Application)}},
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {
            title: 'NewApplication',
            
          }),
        },
      },
    })
    application: Application,
  ): Promise<Application> {
    const memberId = currentUser.id;
    application.memberId = memberId;
    return this.applicationRepository.create(application);
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
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

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
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
    @param.path.number('id') id: number,
    @param.filter(Application, {exclude: 'where'}) filter?: FilterExcludingWhere<Application>
  ): Promise<Application> {
    return this.applicationRepository.findById(id, filter);
  }

  // Todo need to ensure that only sponsor/alumni that created the job AD can update it
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @del('/application/{id}')
  @response(204, {
    description: 'Application DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.applicationRepository.deleteById(id);
  }
}
