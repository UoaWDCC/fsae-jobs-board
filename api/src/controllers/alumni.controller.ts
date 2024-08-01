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
import {Alumni, FsaeRole} from '../models';
import {AlumniRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';

@authenticate('fsae-jwt')
export class AlumniController {
  constructor(
    @repository(AlumniRepository)
    public alumniRepository : AlumniRepository,
  ) {}

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI],
  })
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

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI],
  })
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

  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @del('/user/alumni/{id}')
  @response(204, {
    description: 'Alumni DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.alumniRepository.deleteById(id);
  }
}
