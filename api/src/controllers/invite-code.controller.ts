import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
    get,
    getModelSchemaRef,
    HttpErrors,
    post,
    requestBody,
    response,
} from '@loopback/rest';
import { SecurityBindings, UserProfile, securityId } from '@loopback/security';
import { FsaeRole, InviteCode } from '../models';
import { InviteCodeRepository } from '../repositories';
import { InviteCodeService } from '../services';
import { service } from '@loopback/core';

export class InviteCodeController {
    constructor(
        @repository(InviteCodeRepository)
        private inviteCodeRepository: InviteCodeRepository,
        @service(InviteCodeService)
        private inviteCodeService: InviteCodeService,
        @inject(SecurityBindings.USER)
        private currentUser: UserProfile,
    ) { }

    /**
     * POST /admin/invite-codes
     * Generate a new invite code (Admin only)
     */
    @authenticate('fsae-jwt')
    @authorize({ allowedRoles: [FsaeRole.ADMIN] })
    @post('/admin/invite-codes')
    @response(201, {
        description: 'Invite code created successfully',
        content: {
            'application/json': {
                schema: getModelSchemaRef(InviteCode),
            },
        },
    })
    async createInviteCode(
        @requestBody({
            required: false,
            description: 'Invite code creation parameters',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            code: {
                                type: 'string',
                                description: 'Custom code (auto-generated if not provided)',
                            },
                            maxUses: {
                                type: 'number',
                                description: 'Maximum number of uses (null/undefined for unlimited)',
                            },
                            isActive: {
                                type: 'boolean',
                                description: 'Whether the code is active',
                                default: true,
                            },
                        },
                    },
                },
            },
        })
        body?: {
            code?: string;
            maxUses?: number;
            isActive?: boolean;
        },
    ): Promise<InviteCode> {
        try {
            const inviteCode = await this.inviteCodeService.createInviteCode({
                code: body?.code,
                maxUses: body?.maxUses,
                isActive: body?.isActive,
            });

            return inviteCode;
        } catch (error: any) {
            if (error.statusCode === 409) {
                throw error; // Re-throw conflict error
            }
            throw new HttpErrors.InternalServerError(
                `Failed to create invite code: ${error.message}`,
            );
        }
    }

    /**
     * GET /admin/invite-codes
     * Retrieve all invite codes (Admin only)
     */
    @authenticate('fsae-jwt')
    @authorize({ allowedRoles: [FsaeRole.ADMIN] })
    @get('/admin/invite-codes')
    @response(200, {
        description: 'Array of all invite codes',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: getModelSchemaRef(InviteCode),
                },
            },
        },
    })
    async getAllInviteCodes(): Promise<InviteCode[]> {
        return this.inviteCodeRepository.find({
            order: ['createdAt DESC'],
        });
    }
}
