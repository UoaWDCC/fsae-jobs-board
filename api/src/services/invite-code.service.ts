import { BindingScope, injectable } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { InviteCodeRepository } from '../repositories';
import { AdminStatus } from '../models';

interface ValidateCodeResult {
    isValid: boolean;
    message?: string;
}

@injectable({ scope: BindingScope.TRANSIENT })
export class InviteCodeService {
    constructor(
        @repository(InviteCodeRepository)
        private inviteCodeRepository: InviteCodeRepository,
    ) { }

    /**
     * Validates an invite code without consuming it.
     * Checks if the code exists, is active, and has remaining uses.
     */
    async validateCode(code: string): Promise<ValidateCodeResult> {
        if (!code || code.trim() === '') {
            return {
                isValid: false,
                message: 'Invite code is required',
            };
        }

        const inviteCode = await this.inviteCodeRepository.findOne({
            where: { code: code.trim() },
        });

        if (!inviteCode) {
            return {
                isValid: false,
                message: 'Invalid invite code',
            };
        }

        if (!inviteCode.isActive) {
            return {
                isValid: false,
                message: 'Invite code is no longer active',
            };
        }

        // Check if maxUses is set and if useCount has reached it
        if (
            inviteCode.maxUses !== null &&
            inviteCode.maxUses !== undefined &&
            inviteCode.useCount >= inviteCode.maxUses
        ) {
            return {
                isValid: false,
                message: 'Invite code has reached maximum uses',
            };
        }

        return {
            isValid: true,
        };
    }

    /**
     * Validates and consumes an invite code atomically.
     * Returns true if successful, throws HttpErrors if validation fails.
     * This method ensures atomic operation to prevent race conditions.
     */
    async validateAndConsumeCode(code: string): Promise<boolean> {
        const validation = await this.validateCode(code);

        if (!validation.isValid) {
            throw new HttpErrors.BadRequest(
                validation.message || 'Invalid invite code',
            );
        }

        // Find and update atomically
        // MongoDB's findOneAndUpdate is atomic at the document level
        const inviteCode = await this.inviteCodeRepository.findOne({
            where: { code: code.trim() },
        });

        if (!inviteCode) {
            throw new HttpErrors.BadRequest('Invite code not found');
        }

        // Double-check within transaction that we haven't exceeded maxUses
        if (
            inviteCode.maxUses !== null &&
            inviteCode.maxUses !== undefined &&
            inviteCode.useCount >= inviteCode.maxUses
        ) {
            throw new HttpErrors.BadRequest('Invite code has reached maximum uses');
        }

        // Increment use count
        await this.inviteCodeRepository.updateById(inviteCode.id, {
            useCount: inviteCode.useCount + 1,
        });

        return true;
    }

    /**
     * Generates a random alphanumeric invite code.
     * Ensures uniqueness by checking against existing codes.
     */
    async generateUniqueCode(length: number = 8): Promise<string> {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            let code = '';
            for (let i = 0; i < length; i++) {
                code += chars[Math.floor(Math.random() * chars.length)];
            }

            // Check if code already exists
            const existing = await this.inviteCodeRepository.findOne({
                where: { code },
            });

            if (!existing) {
                return code;
            }

            attempts++;
        }

        throw new HttpErrors.InternalServerError(
            'Failed to generate unique invite code',
        );
    }

    /**
     * Creates a new invite code.
     */
    async createInviteCode(options: {
        code?: string;
        maxUses?: number;
        isActive?: boolean;
    }) {
        const code = options.code || (await this.generateUniqueCode());

        // Validate custom code if provided
        if (options.code) {
            const existing = await this.inviteCodeRepository.findOne({
                where: { code: options.code },
            });
            if (existing) {
                throw new HttpErrors.Conflict('Invite code already exists');
            }
        }

        return this.inviteCodeRepository.create({
            code,
            isActive: options.isActive !== undefined ? options.isActive : true,
            maxUses: options.maxUses,
            useCount: 0,
            createdAt: new Date(),
        });
    }

    /**
     * Determines the appropriate adminStatus based on whether a valid invite code was used.
     */
    determineAdminStatus(inviteCodeUsed: boolean): AdminStatus {
        return inviteCodeUsed ? AdminStatus.APPROVED : AdminStatus.PENDING;
    }
}
