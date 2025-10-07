export interface Notification {
  id: string;
  issuer: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
