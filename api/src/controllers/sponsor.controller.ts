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
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import { SponsorProfileDto, SponsorProfileDtoFields } from '../dtos/sponsor-profile.dto';
import { ownerOnly } from '../decorators/owner-only.decorator';

@authenticate('fsae-jwt')
export class SponsorController {
  constructor(
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
    @repository(SponsorRepository)
    public sponsorRepository : SponsorRepository, 
  ) {}

  @authorize({
    allowedRoles: [FsaeRole.SPONSOR, FsaeRole.MEMBER, FsaeRole.ALUMNI],
  })
  @get('/user/sponsor/{id}')
  @response(200, {
    description: 'Sponsor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SponsorProfileDto, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<SponsorProfileDto> {
    return this.sponsorRepository.findById(id, SponsorProfileDtoFields);
  }

  @authorize({
    allowedRoles: [FsaeRole.SPONSOR],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @patch('/user/sponsor/{id}')
  @response(204, {
    description: 'Sponsor PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SponsorProfileDto, {partial: true}),
        },
      },
    })
    sponsorDto: Partial<SponsorProfileDto>,
  ): Promise<void> {
    await this.sponsorRepository.updateById(id, sponsorDto);
  }

  @authorize({
    allowedRoles: [FsaeRole.ADMIN, FsaeRole.SPONSOR],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @del('/user/sponsor/{id}')
  @response(204, {
    description: 'Sponsor DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sponsorRepository.deleteById(id);
  }
}
