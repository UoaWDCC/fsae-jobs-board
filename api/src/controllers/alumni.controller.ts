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
import {AlumniProfileDto, AlumniProfileDtoFields} from '../dtos/alumni-profile.dto';
import {AlumniRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { ownerOnly } from '../decorators/owner-only.decorator';

@authenticate('fsae-jwt')
export class AlumniController {
  constructor(
    @repository(AlumniRepository)
    public alumniRepository : AlumniRepository,
  ) {}

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.MEMBER, FsaeRole.SPONSOR, FsaeRole.ADMIN],
  })
  @get('/user/alumni/{id}')
  @response(200, {
    description: 'Alumni model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AlumniProfileDto, {
          title: 'Alumni Profile',
        }),
      },
    },
  })
  async getAlumniProfile(
    @param.path.string('id') id: string,
  ): Promise<AlumniProfileDto> {
    const result = await this.alumniRepository.findById(id, {
      fields: AlumniProfileDtoFields,
    });
    return result as AlumniProfileDto;
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @patch('/user/alumni/{id}')
  @response(204, {
    description: 'Alumni PATCH success',
  })
  async updateAlumniProfile(
    @param.path.string('id') id: string,
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
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.alumniRepository.deleteById(id);
  }
}
