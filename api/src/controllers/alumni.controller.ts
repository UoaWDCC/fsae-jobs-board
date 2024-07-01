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

  @get('/user/alumni/{id}')
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

  @patch('/user/alumni/{id}')
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

  @del('/user/alumni/{id}')
  @response(204, {
    description: 'Alumni DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.alumniRepository.deleteById(id);
  }
}
