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
import {FsaeRole, Sponsor} from '../models';
import {SponsorRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';

@authenticate('fsae-jwt')
export class SponsorController {
  constructor(
    @repository(SponsorRepository)
    public sponsorRepository : SponsorRepository,
  ) {}

  @authorize({
    allowedRoles: [FsaeRole.SPONSOR],
  })
  @get('/user/sponsor/{id}')
  @response(200, {
    description: 'Sponsor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Sponsor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Sponsor, {exclude: 'where'}) filter?: FilterExcludingWhere<Sponsor>
  ): Promise<Sponsor> {
    return this.sponsorRepository.findById(id, filter);
  }

  @authorize({
    allowedRoles: [FsaeRole.SPONSOR],
  })
  @patch('/user/sponsor/{id}')
  @response(204, {
    description: 'Sponsor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sponsor, {partial: true}),
        },
      },
    })
    sponsor: Sponsor,
  ): Promise<void> {
    await this.sponsorRepository.updateById(id, sponsor);
  }

  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @del('/user/sponsor/{id}')
  @response(204, {
    description: 'Sponsor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.sponsorRepository.deleteById(id);
  }
}
