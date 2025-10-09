import {
  repository,
} from '@loopback/repository';
import { AdminLogRepository, AdminRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import {FsaeRole} from '../models';
import {get, param, response, patch, requestBody} from '@loopback/rest';
import {RequestStatus, REQUEST_STATUSES} from '../models/admin-log.model';

@authenticate('fsae-jwt')
export class AdminLogController {
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

    @authorize({
        allowedRoles: [FsaeRole.ADMIN],
    })
    @patch('/admin-log/{id}/status')
    @response(200, {
      description: 'Admin log status updated',
      content: {'application/json': {schema: {type: 'object'}}},
    })
    async updateAdminLogStatus(
      @param.path.string('id') id: string,
      @requestBody({
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {type: 'string', enum: REQUEST_STATUSES.filter(s => s !== 'pending')},
              },
              required: ['status'],
            },
          },
        },
      })
      body: {status: RequestStatus},
    ): Promise<object> {
      const log = await this.adminLogRepository.findById(id).catch(() => null);
      if (!log) {
        return {success: false, message: 'Admin log not found'};
      }
      if (log.logType !== 'request') {
        return {success: false, message: 'Only request logs can be accepted or rejected'};
      }
      if (!REQUEST_STATUSES.includes(body.status) || body.status === 'pending') {
        return {success: false, message: 'Invalid status'};
      }
      await this.adminLogRepository.updateById(id, {status: body.status});
      return {success: true, id, status: body.status};
    }
}