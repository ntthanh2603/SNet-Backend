export interface Notification {
  thumbnail: string;
  actors: string[];
  action: NotificateAction;
  detail: string;
  timestamp: string;
}

export enum NotificateAction {
  follow = 'followed',
  like = 'liked',
  repost = 'reposted',
  comment = 'commented',
}

