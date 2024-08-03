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
import {Alumni} from '../models';
import {AlumniRepository} from '../repositories';

export class AlumniController {
  constructor(
    @repository(AlumniRepository)
    public alumniRepository : AlumniRepository,
  ) {}

  @post('/alumni')
  @response(200, {
    description: 'Alumni model instance',
    content: {'application/json': {schema: getModelSchemaRef(Alumni)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alumni, {
            title: 'NewAlumni',
            exclude: ['id'],
          }),
        },
      },
    })
    alumni: Omit<Alumni, 'id'>,
  ): Promise<Alumni> {
    return this.alumniRepository.create(alumni);
  }

  @get('/alumni/count')
  @response(200, {
    description: 'Alumni model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Alumni) where?: Where<Alumni>,
  ): Promise<Count> {
    return this.alumniRepository.count(where);
  }

  @get('/alumni')
  @response(200, {
    description: 'Array of Alumni model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Alumni, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Alumni) filter?: Filter<Alumni>,
  ): Promise<Alumni[]> {
    return this.alumniRepository.find(filter);
  }

  @patch('/alumni')
  @response(200, {
    description: 'Alumni PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alumni, {partial: true}),
        },
      },
    })
    alumni: Alumni,
    @param.where(Alumni) where?: Where<Alumni>,
  ): Promise<Count> {
    return this.alumniRepository.updateAll(alumni, where);
  }

  @get('/alumni/{id}')
  @response(200, {
    description: 'Alumni model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Alumni, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Alumni, {exclude: 'where'}) filter?: FilterExcludingWhere<Alumni>
  ): Promise<Alumni> {
    return this.alumniRepository.findById(id, filter);
  }

  @patch('/alumni/{id}')
  @response(204, {
    description: 'Alumni PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alumni, {partial: true}),
        },
      },
    })
    alumni: Alumni,
  ): Promise<void> {
    await this.alumniRepository.updateById(id, alumni);
  }

  @put('/alumni/{id}')
  @response(204, {
    description: 'Alumni PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() alumni: Alumni,
  ): Promise<void> {
    await this.alumniRepository.replaceById(id, alumni);
  }

  @del('/alumni/{id}')
  @response(204, {
    description: 'Alumni DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.alumniRepository.deleteById(id);
  }
}
