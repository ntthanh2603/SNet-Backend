import { getAction } from '@utils/get-Action';
import { getSummaryNames } from '@utils/get-summary-names';
import { getTimeAgo } from '@utils/get-time-ago';
import { NotificateAction, Notification } from '../../../types/notification';
import { Typography } from '@components/typography';
import { CircleAvatar } from './circle-avatar';

interface NItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NItemProps> = ({ notification }) => {
  const actors = getSummaryNames(notification.actors);
  const action = getAction(notification.action);
  const upperItem = generateActionIcon(notification.action);
  const timeAgo = getTimeAgo(notification.timestamp);
  return (
    <li className="bg-neutral2-2 rounded-[20px] p-3 flex gap-2.5 items-center self-stretch">
      <CircleAvatar
        path={notification.thumbnail}
        upperItem={upperItem}
        className=""
      />
      <div className="flex flex-1 flex-col gap-3">
        <span className="inline-flex flex-wrap gap-1">
          <Typography
            level="base2r"
            className="line-clamp-2 font-bold text-primary opacity-80"
          >
            {actors}
          </Typography>
          <Typography level="base2r" className="text-tertiary">
            {action}
          </Typography>
        </span>
        {notification.detail && (
          <Typography level="base2r" className="text-primary">
            {notification.detail}
          </Typography>
        )}
        <Typography level="base2r" className="text-tertiary">
          {timeAgo}
        </Typography>
      </div>
    </li>
  );
};

const generateActionIcon = (action: NotificateAction) => {
  switch (action) {
    case NotificateAction.follow:
      return (
        <div className="p-[5px] bg-[#8B33E2] rounded-full">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="heart" opacity="0.8">
              <path
                id="heart-icon"
                d="M6 1.875V6M6 6V10.125M6 6H1.875M6 6H10.125"
                stroke="#F8F8F8"
                strokeOpacity="0.95"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      );
    case NotificateAction.like:
      return (
        <div className="p-[5px] bg-wine rounded-full">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="heart" opacity="0.8">
              <path
                id="heart-icon"
                d="M6.18348 10.702C10.5433 8.25233 11.5429 5.38357 10.7585 3.42289C10.3749 2.4641 9.57104 1.77961 8.62611 1.5684C7.7669 1.37635 6.8197 1.58156 5.99976 2.27478C5.17982 1.58156 4.23262 1.37635 3.37341 1.5684C2.42848 1.77961 1.62462 2.46411 1.24104 3.4229C0.456646 5.38358 1.45621 8.25234 5.8161 10.702C5.93017 10.7661 6.06941 10.7661 6.18348 10.702Z"
                fill="#F8F8F8"
                fillOpacity="0.95"
              />
            </g>
          </svg>
        </div>
      );
    case NotificateAction.repost:
      return (
        <div className="p-[5px] bg-[#21B17E] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <g opacity="0.8">
              <path
                d="M2.375 6.625V5.875C2.375 4.21815 3.71815 2.875 5.375 2.875H7.55357M6.32286 1.375L7.87643 2.875L6.32286 4.375M9.625 5.375V6.125C9.625 7.78185 8.28185 9.125 6.625 9.125H4.44643M5.67714 10.625L4.12357 9.125L5.67714 7.625"
                stroke="#F8F8F8"
                strokeOpacity="0.95"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      );
    case NotificateAction.comment:
      return (
        <div className="p-[5px] bg-[#127DFA] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <g opacity="0.8">
              <path
                d="M8.62598 1.5C9.66151 1.5 10.501 2.33947 10.501 3.375V8.125C10.501 9.16053 9.66151 10 8.62598 10H4.01937C3.99595 10 3.97299 10.0066 3.95312 10.019L2.07473 11.193C1.95913 11.2653 1.81342 11.2691 1.69419 11.203C1.57495 11.1369 1.50098 11.0113 1.50098 10.875V3.375C1.50098 2.33947 2.34044 1.5 3.37598 1.5H8.62598Z"
                fill="#F8F8F8"
                fillOpacity="0.95"
              />
            </g>
          </svg>
        </div>
      );
    default:
      return (
        <div className="p-[5px] bg-[#21B17E] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <g opacity="0.8">
              <path
                d="M2.375 6.625V5.875C2.375 4.21815 3.71815 2.875 5.375 2.875H7.55357M6.32286 1.375L7.87643 2.875L6.32286 4.375M9.625 5.375V6.125C9.625 7.78185 8.28185 9.125 6.625 9.125H4.44643M5.67714 10.625L4.12357 9.125L5.67714 7.625"
                stroke="#F8F8F8"
                strokeOpacity="0.95"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      );
  }
};
