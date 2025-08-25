export interface UserNotification {
  notificationId: number;
  userId: number;
  title: string;
  message: string;
  imageUrl?: string;
  read: boolean;
  type: string;
}
