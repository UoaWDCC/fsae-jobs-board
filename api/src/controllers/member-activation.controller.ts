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
import {FsaeUser} from '../models';
import {FsaeUserRepository} from '../repositories';

export class MemberActivationController {
  constructor(
    @repository(FsaeUserRepository)
    public fsaeUserRepository : FsaeUserRepository,
  ) {}

  @post('/fsae-users')
  @response(200, {
    description: 'FsaeUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(FsaeUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FsaeUser, {
            title: 'NewFsaeUser',
            exclude: ['id'],
          }),
        },
      },
    })
    fsaeUser: Omit<FsaeUser, 'id'>,
  ): Promise<FsaeUser> {
    return this.fsaeUserRepository.create(fsaeUser);
  }

  @get('/fsae-users/count')
  @response(200, {
    description: 'FsaeUser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FsaeUser) where?: Where<FsaeUser>,
  ): Promise<Count> {
    return this.fsaeUserRepository.count(where);
  }

  @get('/fsae-users')
  @response(200, {
    description: 'Array of FsaeUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FsaeUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FsaeUser) filter?: Filter<FsaeUser>,
  ): Promise<FsaeUser[]> {
    return this.fsaeUserRepository.find(filter);
  }

  @patch('/fsae-users')
  @response(200, {
    description: 'FsaeUser PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FsaeUser, {partial: true}),
        },
      },
    })
    fsaeUser: FsaeUser,
    @param.where(FsaeUser) where?: Where<FsaeUser>,
  ): Promise<Count> {
    return this.fsaeUserRepository.updateAll(fsaeUser, where);
  }

  @get('/fsae-users/{id}')
  @response(200, {
    description: 'FsaeUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FsaeUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FsaeUser, {exclude: 'where'}) filter?: FilterExcludingWhere<FsaeUser>
  ): Promise<FsaeUser> {
    return this.fsaeUserRepository.findById(id, filter);
  }

  @patch('/fsae-users/{id}')
  @response(204, {
    description: 'FsaeUser PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FsaeUser, {partial: true}),
        },
      },
    })
    fsaeUser: FsaeUser,
  ): Promise<void> {
    await this.fsaeUserRepository.updateById(id, fsaeUser);
  }

  @put('/fsae-users/{id}')
  @response(204, {
    description: 'FsaeUser PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() fsaeUser: FsaeUser,
  ): Promise<void> {
    await this.fsaeUserRepository.replaceById(id, fsaeUser);
  }

  @del('/fsae-users/{id}')
  @response(204, {
    description: 'FsaeUser DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.fsaeUserRepository.deleteById(id);
  }
}
