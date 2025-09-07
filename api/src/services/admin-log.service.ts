import {repository} from '@loopback/repository';
import { AdminLogRepository } from '../repositories';
import { AdminLog } from '../models/admin-log.model';
import { AdminLogDetails } from '../models/admin-log.model';

export class AdminLogService {
    constructor(
        @repository(AdminLogRepository) private adminLogRepository: AdminLogRepository,
    ) {}

    async createAdminLog(
        userId: string,
        details: AdminLogDetails,
    ): Promise<void> {
        this.adminLogRepository.create({userId, details}).catch(err => {
            console.error('[AdminLogService] Failed to create admin log:', err);
        });
    }
}