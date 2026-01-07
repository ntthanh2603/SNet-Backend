import { NotificateAction } from '../types/notification';

export const getAction = (action: NotificateAction): string => {
  switch (action) {
    case NotificateAction.follow:
      return 'followed you';
    case NotificateAction.like:
      return 'liked your post';
    case NotificateAction.repost:
      return 'reposted your post';
    case NotificateAction.comment:
      return 'commented on your post';
    default:
      return '';
  }
};
