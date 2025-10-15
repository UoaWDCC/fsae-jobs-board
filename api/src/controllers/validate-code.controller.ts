import { authenticate } from '@loopback/authentication';
import { inject, service } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors, post, requestBody, response } from '@loopback/rest';
import { SecurityBindings, UserProfile, securityId } from '@loopback/security';
import { AdminStatus, FsaeRole } from '../models';
import {
    AdminRepository,
    AlumniRepository,
    MemberRepository,
    SponsorRepository,
} from '../repositories';
import { InviteCodeService } from '../services';
import { authorize } from '@loopback/authorization';

export class ValidateCodeController {
    constructor(
        @repository(AdminRepository) private adminRepository: AdminRepository,
        @repository(AlumniRepository) private alumniRepository: AlumniRepository,
        @repository(MemberRepository) private memberRepository: MemberRepository,
        @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
        @service(InviteCodeService) private inviteCodeService: InviteCodeService,
        @inject(SecurityBindings.USER) private currentUser: UserProfile,
    ) { }

    /**
     * POST /auth/validate-code
     * Validates an invite code and upgrades user's adminStatus to APPROVED
     * Only accessible to authenticated users with adminStatus: PENDING
     */
    @authenticate('fsae-jwt')
    @authorize({
        allowedRoles: [FsaeRole.MEMBER, FsaeRole.ALUMNI, FsaeRole.SPONSOR],
    })
    @post('/auth/validate-code')
    @response(200, {
        description: 'Invite code validated and user status upgraded',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        adminStatus: { type: 'string' },
                    },
                },
            },
        },
    })
    async validateCode(
        @requestBody({
            required: true,
            description: 'Invite code to validate',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['code'],
                        properties: {
                            code: { type: 'string' },
                        },
                    },
                },
            },
        })
        body: { code: string },
    ): Promise<{ message: string; adminStatus: string }> {
        const userId = this.currentUser[securityId];
        const userRole = this.currentUser.role;

        // Get the user's current adminStatus
        let repo;
        if (userRole === FsaeRole.ALUMNI) {
            repo = this.alumniRepository;
        } else if (userRole === FsaeRole.MEMBER) {
            repo = this.memberRepository;
        } else if (userRole === FsaeRole.SPONSOR) {
            repo = this.sponsorRepository;
        } else {
            throw new HttpErrors.BadRequest('Invalid user role');
        }

        const user = await repo.findById(userId);

        if (!user) {
            throw new HttpErrors.NotFound('User not found');
        }

        // Check if user is already approved
        if (user.adminStatus === AdminStatus.APPROVED) {
            throw new HttpErrors.BadRequest('User is already approved');
        }

        // Check if user was rejected
        if (user.adminStatus === AdminStatus.REJECTED) {
            throw new HttpErrors.BadRequest(
                'Cannot validate code for rejected accounts. Please contact an administrator.',
            );
        }

        // Validate and consume the invite code
        try {
            await this.inviteCodeService.validateAndConsumeCode(body.code);
        } catch (error: any) {
            throw new HttpErrors.BadRequest(
                error.message || 'Invalid invite code',
            );
        }

        // Update user's adminStatus to APPROVED
        await repo.updateById(userId, {
            adminStatus: AdminStatus.APPROVED,
        });

        return {
            message: 'Invite code validated successfully. Your account is now approved.',
            adminStatus: AdminStatus.APPROVED,
        };
    }
}
