import {
  repository,
} from '@loopback/repository';
import { AdminLogRepository, AdminRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import {FsaeRole} from '../models';
import {get, param, response} from '@loopback/rest';

@authenticate('fsae-jwt')
export class AlumniController {
    constructor(
        @repository(AdminLogRepository)
        private adminLogRepository: AdminLogRepository,
        @repository(AdminRepository)
        private adminRepository: AdminRepository,
    ) {}

    @authorize({
        allowedRoles: [FsaeRole.ADMIN],
    })
    @get('/admin-log/')
    @response(200, {
      description: 'Paginated admin logs',
      content: {'application/json': {schema: {type: 'array', items: {type: 'object'}}}},
    })
    async getAdminLogs(
      @param.query.number('skip') skip: number = 0,
      @param.query.number('limit') limit: number = 20,
    ): Promise<object[]> {
      const logs = await this.adminLogRepository.find({
        skip,
        limit,
        order: ['createdAt DESC'],
      });

      // Replace userId with admin username
      const result = await Promise.all(
        logs.map(async log => {
          // Try to find admin by userId
          const admin = await this.adminRepository.findById(log.userId).catch(() => null);
          return {
            ...log,
            userId: undefined,
            username: admin
              ? `${admin.firstName} ${admin.lastName}`
              : log.userId, // fallback to userId if not found
          };
        })
      );

      return result;
    }
}