import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import { AdminLogRepository } from '../repositories';
import { AdminLog } from '../models/admin-log.model';

export type LogType = 'log' | 'request';
export type RequestStatus = 'pending' | 'accepted' | 'rejected';
export interface AdminLogDetails {
  message: string;
  [key: string]: string; // allows any other string fields
}

@injectable({scope: BindingScope.SINGLETON})
export class AdminLogService {
    constructor(
    @repository(AdminLogRepository)
    private adminLogRepository: AdminLogRepository,
  ) {}

  /**
   * Create an admin log
   * - Defaults logType to "log"
   * - If logType is "request" and status is not provided, defaults to "pending"
   */
  createAdminLog(
    userId: string,
    details: AdminLogDetails,
    opts?: {logType?: LogType; status?: RequestStatus},
  ): void {
    const logType: LogType = opts?.logType ?? 'log';
    const status: RequestStatus | undefined =
      logType === 'request' ? opts?.status ?? 'pending' : opts?.status;

    this.adminLogRepository
      .create({
        userId,
        details,
        logType,
        status, // will be undefined for a plain "log" unless caller provides it
      } as Partial<AdminLog> as AdminLog) // cast if your Repo expects AdminLog
      .catch(err => {
        console.error(
          `[AdminLogService] Failed to create ${logType} for user ${userId}:`,
          err,
        );
      });
  }
}
