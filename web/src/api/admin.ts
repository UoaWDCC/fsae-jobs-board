import {apiInstance} from './ApiInstance';
import {AdminReview}  from '@/models/adminReview.model';
import {FsaeRole}     from '@/models/roles';
import {Status}       from '@/app/type/status';

export const adminApi = {
  async getDashboardRequests(): Promise<AdminReview[]> {
    const {data} = await apiInstance.get<AdminReview[]>('user/admin/dashboard');
    return data;
  },

  async updateStatus(
    id: string,
    role: FsaeRole,
    status: Status.APPROVED | Status.REJECTED,
  ): Promise<void> {
    await apiInstance.patch(`user/admin/status/${id}`, {role, status});
  },

  async deleteJob(id: string, reason: string): Promise<void> {
    try{
      await apiInstance.delete(`job/${id}`, {
      data: {reason},
    });
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  },

  async getAdminLogs(skip = 0, limit = 20): Promise<any[]> {
    const {data} = await apiInstance.get<any[]>(`admin-log/?skip=${skip}&limit=${limit}`);
    return data;
  },

  async updateAdminLogStatus(id: string, status: 'accepted' | 'rejected'): Promise<{success: boolean; id?: string; status?: string; message?: string}> {
    const {data} = await apiInstance.patch(`admin-log/${id}/status`, {status});
    return data;
  },

  async deactivateAccount(
    id: string,
    role: FsaeRole,
    reason: string,
  ): Promise<void> {
    await apiInstance.patch(`user/admin/deactivate/${id}`, {role, reason});
  },

  async activateAccount(
    id: string,
    role: FsaeRole,
  ): Promise<void> {
    await apiInstance.patch(`user/admin/activate/${id}`, {role});
  },

  async createAdmin(adminData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: FsaeRole.ALUMNI | FsaeRole.MEMBER;
  }): Promise<{id: string; email: string; message: string}> {
    const {data} = await apiInstance.post<{id: string; email: string; message: string}>('user/admin', adminData);
    return data;
  },

  async deleteAdmin(
    id: string,
    reason: string,
  ): Promise<void> {
    await apiInstance.delete(`user/admin/${id}`, {
      data: {reason},
    });
  },
};
