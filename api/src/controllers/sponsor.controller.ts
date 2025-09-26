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
  RestBindings,
  Response,
  Request,
} from '@loopback/rest';
import {FsaeRole, Sponsor} from '../models';
import {SponsorRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import { SponsorProfileDto, SponsorProfileDtoFields } from '../dtos/sponsor-profile.dto';
import { ownerOnly } from '../decorators/owner-only.decorator';
import { FileHandlerService } from '../services/file-handling.service';

@authenticate('fsae-jwt')
export class SponsorController {

  private fileHandler: FileHandlerService;

  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
    @repository(SponsorRepository)
    public sponsorRepository : SponsorRepository, 
  ) {
    this.fileHandler = new FileHandlerService(this.sponsorRepository);
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.MEMBER, FsaeRole.SPONSOR, FsaeRole.ADMIN],
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
  
  @post('user/sponsor/{id}/upload-avatar')
  @authenticate('fsae-jwt')
  @authorize({ allowedRoles: [FsaeRole.SPONSOR] })
  @response(200, { description: 'Avatar uploaded successfully' })
  async uploadAvatar(@inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleUpload(this.sponsorRepository, this.currentUserProfile, this.req, 'avatar', 'avatarS3Key', response);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN, FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @get('/user/sponsor/{id}/avatar')
  async viewAvatar(@param.path.string('id') id: string, @inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleViewFile(this.sponsorRepository, id, 'avatarS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.SPONSOR, FsaeRole.ADMIN],
  })
  @patch('/user/sponsor/{id}/delete-avatar')
  async deleteAvatar(@param.path.string('id') id: string) {
    return this.fileHandler.handleDeleteFile(this.sponsorRepository, id, 'avatarS3Key');
  }

  @authenticate('fsae-jwt')
  @authorize({ allowedRoles: [FsaeRole.SPONSOR] })
  @post('user/sponsor/{id}/upload-banner')
  @response(200, { description: 'Banner uploaded successfully' })
  async uploadBanner(@inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleUpload(this.sponsorRepository, this.currentUserProfile, this.req, 'banner', 'bannerS3Key', response);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN, FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @get('/user/sponsor/{id}/banner')
  async viewBanner(@param.path.string('id') id: string, @inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleViewFile(this.sponsorRepository, id, 'bannerS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.SPONSOR, FsaeRole.ADMIN],
  })
  @patch('/user/sponsor/{id}/delete-banner')
  async deleteBanner(@param.path.string('id') id: string) {
    return this.fileHandler.handleDeleteFile(this.sponsorRepository, id, 'bannerS3Key');
  }
}
