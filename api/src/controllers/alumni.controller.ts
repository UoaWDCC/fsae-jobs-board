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
  HttpErrors,
} from '@loopback/rest';
import { Alumni } from '../models';
import { AlumniRepository } from '../repositories';
import { authorize } from '@loopback/authorization';
import { authenticate } from '@loopback/authentication';

export class AlumniController {
  constructor(
    @repository(AlumniRepository)
    public alumniRepository: AlumniRepository,
  ) { }

  @post('/alumni')
  @response(200, {
    description: 'Alumni model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Alumni) } },
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
    content: { 'application/json': { schema: CountSchema } },
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
          items: getModelSchemaRef(Alumni, { includeRelations: true }),
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
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alumni, { partial: true }),
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
        schema: getModelSchemaRef(Alumni, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Alumni, { exclude: 'where' }) filter?: FilterExcludingWhere<Alumni>
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
          schema: getModelSchemaRef(Alumni, { partial: true }),
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

  // Method to check if an alumni is activated
  @get('/alumni/{id}/is-activated')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN',],
  })
  @response(200, {
    description: 'Check if alumni is activated',
    content: { 'application/json': { schema: { type: 'boolean' } } },
  })
  async isActivated(@param.path.number('id') id: number): Promise<boolean> {
    const alumni = await this.alumniRepository.findById(id);
    if (!alumni) {
      throw new HttpErrors.NotFound(`Alumni with id ${id} not found.`);
    }
    return alumni.activated;
  }

  // Method to activate an alumni
  @patch('/alumni/{id}/activate')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN'],
  })
  @response(204, {
    description: 'Activate alumni',
  })
  async activate(@param.path.number('id') id: number): Promise<void> {
    await this.alumniRepository.updateById(id, { activated: true });
  }

  // Method to deactivate an alumni
  @patch('/alumni/{id}/deactivate')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN'],
  })
  @response(204, {
    description: 'Deactivate alumni',
  })
  async deactivate(@param.path.number('id') id: number): Promise<void> {
    await this.alumniRepository.updateById(id, { activated: false });
  }
}
