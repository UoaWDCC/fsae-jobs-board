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
import {FsaeRole, Sponsor} from '../models';
import {SponsorRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {
  SponsorProfileDto,
  SponsorProfileDtoFields,
} from '../dtos/sponsor-profile.dto';
import {ownerOnly} from '../decorators/owner-only.decorator';
import {validateEmail} from '../utils/validateEmail';

@authenticate('fsae-jwt')
export class SponsorController {
  constructor(
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
    @repository(SponsorRepository)
    public sponsorRepository: SponsorRepository,
  ) {}

  @authorize({
    allowedRoles: [
      FsaeRole.ALUMNI,
      FsaeRole.MEMBER,
      FsaeRole.SPONSOR,
      FsaeRole.ADMIN,
    ],
  })
  @get('/user/sponsor')
  @response(200, {
    description: 'Array of Sponsor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Sponsor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Sponsor) filter?: Filter<Sponsor>,
  ): Promise<Sponsor[]> {
    return this.sponsorRepository.find(filter);
  }

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
    if ('email' in sponsorDto) {
      console.log('Validating email:', sponsorDto.email);
      const {valid, message} = validateEmail(sponsorDto);
      if (!valid) {
        console.log('Email validation failed:', message);
        throw new HttpErrors.BadRequest(message);
      }
      console.log('Email validation passed');
    }
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
