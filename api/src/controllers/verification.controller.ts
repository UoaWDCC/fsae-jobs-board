import { inject } from '@loopback/core';
import {
    repository,
} from '@loopback/repository';
import {
    post,
    HttpErrors,
    requestBody,
} from '@loopback/rest';
import {
    VerificationRepository,
    MemberRepository,
    AlumniRepository,
    SponsorRepository,
    AdminRepository,
} from '../repositories';
import { TwilioService } from '../services';

export class VerificationController {
    constructor(
        @repository(VerificationRepository)
        public verificationRepository: VerificationRepository,

        @repository(MemberRepository)
        public memberRepository: MemberRepository,

        @repository(AlumniRepository)
        public alumniRepository: AlumniRepository,

        @repository(SponsorRepository)
        public sponsorRepository: SponsorRepository,

        @repository(AdminRepository)
        public adminRepository: AdminRepository,

        @inject('services.twilioService') private twilioService: TwilioService

    ) { }

    @post('/verify')
    async verifyUser(
        @requestBody({
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: { type: 'string' },
                            verification_code: { type: 'string' },
                        },
                        required: ['email', 'verification_code'],
                    },
                },
            },
        })
        verificationDto: { email: string; verification_code: string }
    ): Promise<boolean> {
        const { email, verification_code } = verificationDto;

        const verification = await this.verificationRepository.findOne({
            where: { email },
        });

        if (!verification) {
            throw new HttpErrors.NotFound('Verification not found');
        }

        if (verification.verification_code !== verification_code) {
            throw new HttpErrors.BadRequest('Verification code invalid');
        }

        const roleRepository = this.repositoryMap[verification.fsaeRole as 'student' | 'alumni' | 'sponsor' | 'admin'];

        if (!roleRepository) {
            throw new HttpErrors.InternalServerError('User role invalid');
        }

        const user = await roleRepository.findOne({ where: { email: verification.email } });
        if (!user) {
            throw new HttpErrors.NotFound('User not found');
        }

        await roleRepository.updateById(user.id, { verified: true });
        await this.verificationRepository.deleteById(verification.id);
        await this.twilioService.verifyUser(verification.twilioId);

        return true;
    }
    
    private get repositoryMap() {
    return {
        student: this.memberRepository,
        alumni: this.alumniRepository,
        sponsor: this.sponsorRepository,
        admin: this.adminRepository,
    };
}
}
