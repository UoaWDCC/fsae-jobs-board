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
import {AlumniRepository} from '../repositories';

export class MemberActivationController {
  constructor(
    @repository(AlumniRepository)
    public alumniRepository : AlumniRepository,
  ) {}

  @post('/member-activation')
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
    return this.alumniRepository.create(fsaeUser);
  }

  @get('/member-activation/count')
  @response(200, {
    description: 'FsaeUser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FsaeUser) where?: Where<FsaeUser>,
  ): Promise<Count> {
    return this.alumniRepository.count(where);
  }

  @get('/member-activation')
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
    return this.alumniRepository.find(filter);
  }

  @patch('/member-activation')
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
    return this.alumniRepository.updateAll(fsaeUser, where);
  }

  @get('/member-activation/{id}')
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
    return this.alumniRepository.findById(id, filter);
  }

  @patch('/member-activation/{id}')
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
    await this.alumniRepository.updateById(id, fsaeUser);
  }

  @put('/member-activation/{id}')
  @response(204, {
    description: 'FsaeUser PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() fsaeUser: FsaeUser,
  ): Promise<void> {
    await this.alumniRepository.replaceById(id, fsaeUser);
  }

  @del('/member-activation/{id}')
  @response(204, {
    description: 'FsaeUser DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.alumniRepository.deleteById(id);
  }
}
