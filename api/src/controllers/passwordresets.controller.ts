import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, post, HttpErrors, requestBody, param} from '@loopback/rest';
import {
  VerificationRepository,
  MemberRepository,
  AlumniRepository,
  SponsorRepository,
  AdminRepository,
} from '../repositories';
import { BindingKeys } from '../constants/binding-keys';
import {TwilioService, GeneratorService, PasswordHasherService} from '../services';
import {PasswordResetsRepository} from '../repositories/passwordresets.repository';

export class passwordResetsController {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @repository(PasswordResetsRepository)
    private passwordResetsRepository: PasswordResetsRepository,
    @inject('services.generator') private generator: GeneratorService,
    @inject('services.twilioService') private twilioService: TwilioService,
    @inject(BindingKeys.PASSWORD_HASHER) private passwordHasher: PasswordHasherService,
) {}

  async findMemberByEmail(email: string) {
    for (const [role, repository] of Object.entries(this.repositoryMap)) {
      const foundUser = await repository.findOne({where: {email}});
      if (foundUser) {
        return {user: foundUser, role}; // Return both user and role
      }
    }
    return null; // Return null if no user is found
  }

  @post('/forgot-password')
  async requestPasswordReset(@requestBody() body: {email: string}) {
    const userRoleData = await this.findMemberByEmail(body.email);

    if (userRoleData) {
      const {user, role} = userRoleData;
      const resetToken = await this.generator.generateToken();
      

      let nameForResetEmail = "User"
      if ('firstName' in user) {
          nameForResetEmail = user.firstName
      } else if ('companyName' in user) {
          nameForResetEmail = user.companyName
      }
      const passwordResetEmail = await this.twilioService.sendPasswordResetEmail(body.email, nameForResetEmail, resetToken);

      const passwordReset = await this.passwordResetsRepository.create({
        email: body.email,
        resetToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 2, // 2 hours from now
        role : role,
        twilioId: passwordResetEmail.sid,
      });

      return true;
    }
  }

  @get('/reset-password/{token}')
  async validateResetToken(@param.path.string('token') token: string) {
    const passwordReset = await this.passwordResetsRepository.findOne({where: {resetToken: token}});
    if (!passwordReset) {
      throw new HttpErrors.NotFound('Token not found');
    }
    if (passwordReset.expiresAt < Date.now()) {
      throw new HttpErrors.BadRequest('Token has expired');
    }

    return {email: passwordReset.email};
  }

  @post('/reset-password')
  async resetPassword(@requestBody() body: {token: string; password: string}) {
    const passwordReset = await this.passwordResetsRepository.findOne({where: {resetToken: body.token}});
    
    if (!passwordReset) {
      throw new HttpErrors.NotFound('Token not found');
    }
    if (passwordReset.expiresAt < Date.now()) {
      throw new HttpErrors.BadRequest('Token has expired');
    }

    const userRoleData = await this.findMemberByEmail(passwordReset.email);
    if (userRoleData) {
      const {user, role} = userRoleData;
      const hashedPassword = await this.passwordHasher.hashPassword(body.password);
      await this.repositoryMap[role as keyof typeof this.repositoryMap].updateById(user.id, {password: hashedPassword});
      await this.twilioService.verifyUser(passwordReset.twilioId); // Just informs Twilio that the reset password email has been used 
      await this.passwordResetsRepository.delete(passwordReset);
      return true;
    }
  }


  private get repositoryMap() {
    return {
      member: this.memberRepository,
      alumni: this.alumniRepository,
      sponsor: this.sponsorRepository,
      admin: this.adminRepository,
    };
  }
}
