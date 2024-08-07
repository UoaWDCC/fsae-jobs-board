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
import { FsaeRole, FsaeUser } from '../models';
import {
  AlumniRepository,
  SponsorRepository,
  MemberRepository
} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';

export class MemberActivationController {
  constructor(
    @repository(AlumniRepository)
    public alumniRepository: AlumniRepository,

    @repository(SponsorRepository)
    public sponsorRepository: SponsorRepository,

    @repository(MemberRepository)
    public memberRepository: MemberRepository,
  ) { }

  // Method to check if an alumni is activated
  @get('/alumni/{id}/is-activated')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(200, {
    description: 'Check if alumni is activated',
    content: { 'application/json': { schema: { type: 'boolean' } } },
  })
  async isAlumniActivated(@param.path.number('id') id: string): Promise<boolean> {
    const alumni = await this.alumniRepository.findById(id);
    if (!alumni) {
      throw new HttpErrors.NotFound(`Alumni with id ${id} not found.`);
    }
    return alumni.activated;
  }

  // Method to check if a sponsor is activated
  @get('/sponsors/{id}/is-activated')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(200, {
    description: 'Check if sponsor is activated',
    content: { 'application/json': { schema: { type: 'boolean' } } },
  })
  async isSponsorActivated(@param.path.number('id') id: string): Promise<boolean> {
    const sponsor = await this.sponsorRepository.findById(id);
    if (!sponsor) {
      throw new HttpErrors.NotFound(`Sponsor with id ${id} not found.`);
    }
    return sponsor.activated;
  }


  // Method to check if a member is activated
  @get('/members/{id}/is-activated')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(200, {
    description: 'Check if member is activated',
    content: { 'application/json': { schema: { type: 'boolean' } } },
  })
  async isMemberActivated(@param.path.number('id') id: string): Promise<boolean> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new HttpErrors.NotFound(`Member with id ${id} not found.`);
    }
    return member.activated;
  }

  // Method to activate an alumni
  @patch('/alumni/{id}/activate')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(204, {
    description: 'Activate alumni',
  })
  async activateAlumni(@param.path.number('id') id: string): Promise<void> {
    await this.alumniRepository.updateById(id, { activated: true });
  }

  // Method to deactivate an alumni
  @patch('/alumni/{id}/deactivate')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(204, {
    description: 'Deactivate alumni',
  })
  async deactivateAlumni(@param.path.number('id') id: string): Promise<void> {
    await this.alumniRepository.updateById(id, { activated: false });
  }

  // Method to activate a sponsor
  @patch('/sponsors/{id}/activate')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(204, {
    description: 'Activate sponsor',
  })
  async activateSponsor(@param.path.number('id') id: string): Promise<void> {
    await this.sponsorRepository.updateById(id, { activated: true });
  }

  // Method to deactivate a sponsor
  @patch('/sponsors/{id}/deactivate')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(204, {
    description: 'Deactivate sponsor',
  })
  async deactivateSponsor(@param.path.number('id') id: string): Promise<void> {
    await this.sponsorRepository.updateById(id, { activated: false });
  }

  // Method to activate a member
  @patch('/members/{id}/activate')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(204, {
    description: 'Activate member',
  })
  async activateMember(@param.path.number('id') id: string): Promise<void> {
    await this.memberRepository.updateById(id, { activated: true });
  }

  // Method to deactivate a member
  @patch('/members/{id}/deactivate')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(204, {
    description: 'Deactivate member',
  })
  async deactivateMember(@param.path.number('id') id: string): Promise<void> {
    await this.memberRepository.updateById(id, { activated: false });
  }
}
