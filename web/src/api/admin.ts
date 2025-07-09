import {apiInstance} from './ApiInstance';
import {AdminReview}  from '@/models/adminReview.model';
import {Role}         from '@/app/type/role';
import {Status}       from '@/app/type/status';

export const adminApi = {
  async getDashboardRequests(): Promise<AdminReview[]> {
    const {data} = await apiInstance.get<AdminReview[]>('user/admin/dashboard');
    return data;
  },

  async updateStatus(
    id: string,
    role: Role,
    status: Status.APPROVED | Status.REJECTED,
  ): Promise<void> {
    await apiInstance.patch(`user/admin/status/${id}`, {role, status});
  },
};
