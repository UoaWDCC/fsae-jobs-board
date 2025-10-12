import {Filter, repository,} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
  RestBindings,
  post,
  Response,
  Request,
} from '@loopback/rest';
import {Alumni, FsaeRole} from '../models';
import {AlumniProfileDto, AlumniProfileDtoFields} from '../dtos/alumni-profile.dto';
import {AlumniRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { ownerOnly } from '../decorators/owner-only.decorator';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import { FileHandlerService } from '../services/file-handling.service';

@authenticate('fsae-jwt')
export class AlumniController {

  private fileHandler: FileHandlerService;

  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
    @repository(AlumniRepository) public alumniRepository : AlumniRepository,
  ) {
    this.fileHandler = new FileHandlerService(this.alumniRepository);
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.MEMBER, FsaeRole.SPONSOR, FsaeRole.ADMIN],
  })
  @get('/user/alumni')
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

  @patch('/user/alumni/{id}')
  @response(204, {
    description: 'Alumni PATCH success',
  })
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  async updateAlumniProfile(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AlumniProfileDto, {partial: true}),
        },
      },
    })
    alumniDto: Partial<AlumniProfileDto>,
  ): Promise<void> {
    await this.alumniRepository.updateById(id, alumniDto);
  }

  @authorize({
    allowedRoles: [FsaeRole.ADMIN, FsaeRole.ALUMNI],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @del('/user/alumni/{id}')
  @response(204, {
    description: 'Alumni DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.alumniRepository.deleteById(id);
  }

  @post('user/alumni/{id}/upload-avatar')
  @authenticate('fsae-jwt')
  @authorize({ allowedRoles: [FsaeRole.ALUMNI] })
  @response(200, { description: 'Avatar uploaded successfully' })
  async uploadAvatar(@inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleUpload(this.alumniRepository, this.currentUserProfile, this.req, 'avatar', 'avatarS3Key', response);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN, FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @get('/user/alumni/{id}/avatar')
  async viewAvatar(@param.path.string('id') id: string, @inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleViewFile(this.alumniRepository, id, 'avatarS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.ADMIN],
  })
  @patch('/user/alumni/{id}/delete-avatar')
  async deleteAvatar(@param.path.string('id') id: string) {
    return this.fileHandler.handleDeleteFile(this.alumniRepository, id, 'avatarS3Key');
  }

  @authenticate('fsae-jwt')
  @authorize({ allowedRoles: [FsaeRole.ALUMNI] })
  @post('user/alumni/{id}/upload-banner')
  @response(200, { description: 'Banner uploaded successfully' })
  async uploadBanner(@inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleUpload(this.alumniRepository, this.currentUserProfile, this.req, 'banner', 'bannerS3Key', response);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.MEMBER, FsaeRole.ADMIN, FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @get('/user/alumni/{id}/banner')
  async viewBanner(@param.path.string('id') id: string, @inject(RestBindings.Http.RESPONSE) response: Response) {
    return this.fileHandler.handleViewFile(this.alumniRepository, id, 'bannerS3Key', response, true);
  }

  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.ADMIN],
  })
  @patch('/user/alumni/{id}/delete-banner')
  async deleteBanner(@param.path.string('id') id: string) {
    return this.fileHandler.handleDeleteFile(this.alumniRepository, id, 'bannerS3Key');
  }
}
