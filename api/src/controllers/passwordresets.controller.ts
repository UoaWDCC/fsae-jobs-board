import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, post, HttpErrors, requestBody, param} from '@loopback/rest';
import {
  MemberRepository,
  AlumniRepository,
  SponsorRepository,
  AdminRepository,
} from '../repositories';
import {BindingKeys} from '../constants/binding-keys';
import {
  GeneratorService,
  PasswordHasherService,
  ResendService,
} from '../services';
import {PasswordResetsRepository} from '../repositories/passwordresets.repository';
import {PASSWORD_RESET_LINK} from '../constants/email-constants.ts';

export class passwordResetsController {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @repository(PasswordResetsRepository)
    private passwordResetsRepository: PasswordResetsRepository,
    @inject('services.generator') private generator: GeneratorService,
    @inject('services.resendService') private resendService: ResendService,
    @inject(BindingKeys.PASSWORD_HASHER)
    private passwordHasher: PasswordHasherService,
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
    try {
      const userRoleData = await this.findMemberByEmail(body.email);

      if (!userRoleData) {
        throw new Error('User not found from email');
      }
      const {user, role} = userRoleData;
      const resetToken = await this.generator.generateToken();
      const resetLink = `${PASSWORD_RESET_LINK}?token=${resetToken}`;
      console.log(resetLink);

      const passwordResetEmail =
        await this.resendService.sendPasswordResetEmail(
          body.email,
          user.firstName ?? '',
          resetLink,
        );

      if (!passwordResetEmail) {
        throw new Error('Password reset email not sent');
      }

      const passwordReset = await this.passwordResetsRepository.create({
        email: body.email,
        resetToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 2, // 2 hours from now
        fsaeRole: role,
      });

      if (!passwordReset) {
        throw new Error('Password reset repository not created');
      }
      return true;
    } catch (error) {
      console.error('Error in requestPasswordReset:', error);
      throw new Error('Unable to process request' + error);
    }
  }

  @get('/reset-password/{token}')
  async validateResetToken(@param.path.string('token') token: string) {
    const passwordReset = await this.passwordResetsRepository.findOne({
      where: {resetToken: token},
    });
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
    const passwordReset = await this.passwordResetsRepository.findOne({
      where: {resetToken: body.token},
    });

    if (!passwordReset) {
      throw new HttpErrors.NotFound('Token not found');
    }
    if (passwordReset.expiresAt < Date.now()) {
      throw new HttpErrors.BadRequest('Token has expired');
    }

    const userRoleData = await this.findMemberByEmail(passwordReset.email);
    if (userRoleData) {
      const {user, role} = userRoleData;
      const hashedPassword = await this.passwordHasher.hashPassword(
        body.password,
      );
      await this.repositoryMap[
        role as keyof typeof this.repositoryMap
      ].updateById(user.id, {password: hashedPassword});
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
