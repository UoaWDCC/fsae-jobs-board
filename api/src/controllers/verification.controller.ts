import {
    repository,
} from '@loopback/repository';
import {
    param,
    get,
    response,
    HttpErrors,
} from '@loopback/rest';
import {
    VerificationRepository,
    MemberRepository,
    AlumniRepository,
    SponsorRepository,
    AdminRepository,
} from '../repositories';

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
    ) {}

    @get('/verify')
    @response(200, {
        description: 'Verify a user',
        content: { 'application/json': { schema: { type: 'boolean' } } },
    })
    async verifyUser(@param.query.string('token') token: string): Promise<boolean> {
        const verification = await this.verificationRepository.findOne({
            where: { token },
        });

        if (!verification) {
            throw new HttpErrors.NotFound('Verification token invalid');
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
