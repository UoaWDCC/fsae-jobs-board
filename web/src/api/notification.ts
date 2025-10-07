import { apiInstance } from './ApiInstance';
import { Role } from '@/app/type/role';
import { Notification } from '@/models/notification';

export type NotificationSummary = {
  notifications: Notification[];
  hasUnread: boolean;
  unreadCount: number;
};

export const notificationApi = {
  async getNotifications(role: Role, id: string) {
    const { data } = await apiInstance.get<NotificationSummary>(
      `/user/${role}/notifications/${id}`
    );
    return data;
  },
  async markAsRead(role: Role, id: string) {
    await apiInstance.patch(`/user/${role}/notifications/${id}/read-all`);
  },
};
