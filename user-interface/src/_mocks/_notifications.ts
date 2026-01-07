import { Notification,NotificateAction } from '../types/notification';

export const NOTIFICATIONS: Notification[] = [
  {
    thumbnail: '/img/avatar-1.png',
    actors: ['Kohaku', 'Moyo Shiro', 'Dash', 'Micheal', 'Ash'],
    action: NotificateAction.follow,
    detail: '',
    timestamp: '2024-10-11T10:20:30Z',
  },
  {
    thumbnail: '/img/avatar-2.png',
    actors: ['Kohaku'],
    action: NotificateAction.like,
    detail: '',
    timestamp: '2024-10-11T10:10:30Z',
  },
  {
    thumbnail: '/img/avatar-4.png',
    actors: ['Kohaku'],
    action: NotificateAction.repost,
    detail: 'SimpleList link.com/media.png',
    timestamp: '2024-10-11T07:20:30Z',
  },
  {
    thumbnail: '/img/avatar-5.png',
    actors: ['Kohaky'],
    action: NotificateAction.comment,
    detail: 'Always amazed with how you present your work. Love it so much',
    timestamp: '2024-10-10T10:20:30Z',
  },
  {
    thumbnail: '/img/avatar-6.png',
    actors: ['Kohaku', 'Moyo Shiro', 'Dash', 'Micheal', 'Ash'],
    action: NotificateAction.follow,
    detail: '',
    timestamp: '2024-10-06T10:20:30Z',
  },
  {
    thumbnail: '/img/avatar-7.png',
    actors: ['Kohaky'],
    action: NotificateAction.comment,
    detail: 'Always amazed with how you present your work. Love it so much',
    timestamp: '2024-07-11T10:20:30Z',
  },
  {
    thumbnail: '/img/avatar-3.png',
    actors: ['Kohaku'],
    action: NotificateAction.comment,
    detail: 'Always amazed with how you present your work. Love it so much',
    timestamp: '2024-07-11T10:20:30Z',
  },
];
