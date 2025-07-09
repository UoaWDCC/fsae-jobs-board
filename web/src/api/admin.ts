import {apiInstance} from './ApiInstance';
import {AdminReview} from '@/models/adminReview.model';

export const adminApi = {
  async getDashboardRequests(): Promise<AdminReview[]> {
    try {
      const res = await apiInstance.get<AdminReview[]>('/user/admin/dashboard');
      return res.data;
    } catch (err) {
      console.error('Failed to fetch dashboard requests:', err);
      throw err;
    }
  },
};
