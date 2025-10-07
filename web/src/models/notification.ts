export enum NotificationType {
  ANNOUNCEMENT = 'announcement',
  NOTIFICATION = 'notification',
}

export interface Notification {
  id: string;
  issuer: string;
  title: string;
  msgBody: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}
