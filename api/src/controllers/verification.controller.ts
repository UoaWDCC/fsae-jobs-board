import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, HttpErrors, requestBody} from '@loopback/rest';
import {
  VerificationRepository,
  MemberRepository,
  AlumniRepository,
  SponsorRepository,
  AdminRepository,
} from '../repositories';
import {ResendService, GeneratorService} from '../services';

export class VerificationController {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @repository(VerificationRepository)
    private verificationRepository: VerificationRepository,
    @inject('services.generator') private generator: GeneratorService,
    @inject('services.resendService') private resendService: ResendService,
  ) {}

  @post('/verify')
  async verifyUser(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              verification_code: {type: 'string'},
            },
            required: ['email', 'verification_code'],
          },
        },
      },
    })
    verificationDto: {
      email: string;
      verification_code: string;
    },
  ): Promise<boolean> {
    const {email, verification_code} = verificationDto;

    const verification = await this.verificationRepository.findOne({
      where: {email},
    });

    console.log(verification);

    if (!verification) {
      throw new HttpErrors.NotFound('Verification not found');
    }

    if (verification.verificationCode !== verification_code) {
      throw new HttpErrors.Unauthorized('Incorrect Verification Code');
    }

    if (verification.expiresAt < Date.now()) {
      this.resendVerification({email}); // Resend verification email
      throw new HttpErrors.BadRequest(
        'Verification code expired, new code sent to email',
      );
    }

    const roleRepository =
      this.repositoryMap[
        verification.role as 'member' | 'alumni' | 'sponsor' | 'admin'
      ];

    if (!roleRepository) {
      throw new HttpErrors.InternalServerError('User role invalid');
    }

    const user = await roleRepository.findOne({
      where: {email: verification.email},
    });
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    await roleRepository.updateById(user.id, {verified: true});
    await this.verificationRepository.deleteById(verification.id);

    return true;
  }

  @post('/resend-verification')
  async resendVerification(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
            },
            required: ['email'],
          },
        },
      },
    })
    verificationDto: {
      email: string;
    },
  ): Promise<boolean> {
    const {email} = verificationDto;

    // Find the existing verification entry
    const verification = await this.verificationRepository.findOne({
      where: {email},
    });

    if (!verification) {
      throw new HttpErrors.NotFound('Verification record not found');
    }

    const roleRepository =
      this.repositoryMap[
        verification.role as 'member' | 'alumni' | 'sponsor' | 'admin'
      ];
    if (!roleRepository) {
      throw new HttpErrors.InternalServerError('Role repository not found');
    }

    const user = await roleRepository.findOne({where: {email}});

    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    // Check if rate limiting should apply (within 2 minutes of creation)
    if (Date.now() < verification.createdAt + 1000 * 60 * 2) {
      if (verification.resentOnce) {
        throw new HttpErrors.BadRequest('Rate limit exceeded');
      }
    }

    // Check if properties are defined
    if (!verification.email || !verification.verificationCode) {
      throw new HttpErrors.InternalServerError(
        'Required properties are missing',
      );
    }

    // Delete the old verification record
    try {
      await this.verificationRepository.deleteById(verification.id);
    } catch (error) {
      // Do nothing
    }

    // Send a new verification email
    let nameForVerificationEmail = 'User';
    if ('firstName' in user) {
      nameForVerificationEmail = user.firstName;
    } else if ('companyName' in user) {
      nameForVerificationEmail = user.companyName;
    }

    const {verificationCode} = await this.sendVerificationEmail(
      verification.email,
      nameForVerificationEmail,
    );

    // Create a new verification record
    await this.verificationRepository.create({
      email: verification.email,
      role: verification.role,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 10,
      verificationCode: verificationCode,
      resentOnce: true,
    });

    return true;
  }

  async sendVerificationEmail(email: string, firstName: string) {
    var verificationCode = await this.generator.generateCode();
    var verification = await this.resendService.sendVerificationEmail(
      email,
      firstName,
      verificationCode,
    );
    return {verificationCode};
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
