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
  MemberRepository,
  AdminLogRepository
} from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import {inject} from '@loopback/core';
import { UserProfile} from '@loopback/security';
export class ActivationController {
  constructor(
  @repository(AlumniRepository)
  public alumniRepository: AlumniRepository,

  @repository(SponsorRepository)
  public sponsorRepository: SponsorRepository,

  @repository(MemberRepository)
  public memberRepository: MemberRepository,

  @repository(AdminLogRepository)
  public adminLogRepository: AdminLogRepository,

  @inject(AuthenticationBindings.CURRENT_USER)
  private currentUserProfile: UserProfile,
) {}

  // Method to check if an alumni is activated
  @get('/alumni/{id}/activate')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(200, {
    description: 'Check if alumni is activated',
    content: { 'application/json': { schema: { type: 'boolean' } } },
  })
  async isAlumniActivated(@param.path.string('id') id: string): Promise<boolean> {
    const alumni = await this.alumniRepository.findById(id);
    if (!alumni) {
      throw new HttpErrors.NotFound(`Alumni with id ${id} not found.`);
    }
    return alumni.activated;
  }

  // Method to check if a sponsor is activated
  @get('/sponsors/{id}/activate')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(200, {
    description: 'Check if sponsor is activated',
    content: { 'application/json': { schema: { type: 'boolean' } } },
  })
  async isSponsorActivated(@param.path.string('id') id: string): Promise<boolean> {
    const sponsor = await this.sponsorRepository.findById(id);
    if (!sponsor) {
      throw new HttpErrors.NotFound(`Sponsor with id ${id} not found.`);
    }
    return sponsor.activated;
  }


  // Method to check if a member is activated
  @get('/members/{id}/activate')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  @response(200, {
    description: 'Check if member is activated',
    content: { 'application/json': { schema: { type: 'boolean' } } },
  })
  async isMemberActivated(@param.path.string('id') id: string): Promise<boolean> {
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
  async activateAlumni(@param.path.string('id') id: string): Promise<void> {
    await this.alumniRepository.updateById(id, { activated: true });
    const alumni = await this.alumniRepository.findById(id);
    if (!alumni) {
      throw new HttpErrors.NotFound(`Alumni with id ${id} not found.`);
    }
    await this.logAdminAction('activated-alumni', 'alumni', id, alumni.firstName ?? '', alumni.lastName ?? '');
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
  async deactivateAlumni(@param.path.string('id') id: string): Promise<void> {
    await this.alumniRepository.updateById(id, { activated: false });
    const alumni = await this.alumniRepository.findById(id);
    if (!alumni) {
      throw new HttpErrors.NotFound(`Alumni with id ${id} not found.`);
    }
    await this.logAdminAction('deactivated-alumni', 'alumni', id, alumni.firstName ?? '', alumni.lastName ?? '');
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
  async activateSponsor(@param.path.string('id') id: string): Promise<void> {
    await this.sponsorRepository.updateById(id, { activated: true });
    const sponsor = await this.sponsorRepository.findById(id);
    if (!sponsor) {
      throw new HttpErrors.NotFound(`Sponsor with id ${id} not found.`);
    }
    await this.logAdminAction('activated-sponsor', 'sponsor', id, sponsor.companyName ?? '', "");
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
  async deactivateSponsor(@param.path.string('id') id: string): Promise<void> {
    await this.sponsorRepository.updateById(id, { activated: false });
    const sponsor = await this.sponsorRepository.findById(id);
    if (!sponsor) {
      throw new HttpErrors.NotFound(`Sponsor with id ${id} not found.`);
    }
    await this.logAdminAction('deactivated-sponsor', 'sponsor', id, sponsor.companyName, "");
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
  async activateMember(@param.path.string('id') id: string): Promise<void> {
    await this.memberRepository.updateById(id, { activated: true });
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new HttpErrors.NotFound(`Member with id ${id} not found.`);
    }
    await this.logAdminAction('activated-member', 'member', id, member.firstName ?? '', member.lastName ?? '');
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
  async deactivateMember(@param.path.string('id') id: string): Promise<void> {
    await this.memberRepository.updateById(id, { activated: false });
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new HttpErrors.NotFound(`Member with id ${id} not found.`);
    }
    await this.logAdminAction('deactivated-member', 'member', id, member.firstName ?? '', member.lastName ?? '');
  }

  private async logAdminAction(
  action: string,
  targetType: string,
  targetId: string,
  firstName: string,
  lastName: string
) {
  await this.adminLogRepository.create({
    adminId: this.currentUserProfile.id,
    action,
    targetType,
    targetId,
    metadata: {
      firstName,
      lastName,
    },
    timestamp: new Date().toISOString(),
  });
}
}
