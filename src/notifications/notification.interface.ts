export interface INotiUser {
  user_id: string;
  noti_user_id: string;
  title: string;
  message: string;
  notification_type?: string;
  created_at?: Date;
  is_read?: boolean;
}
