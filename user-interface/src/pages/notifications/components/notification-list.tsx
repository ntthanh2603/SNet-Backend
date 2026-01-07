import { NotificationItem } from "./notification-list-item";
import { Notification } from '../../../types/notification';


interface NotificationListProps {
  notifications: Notification[];
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
}) => {
  return (
    <ul className="no-scrollbar overflow-scroll flex-grow gap-2 flex flex-col relative">
      {notifications.map((noti, i) => (
        <NotificationItem key={i} notification={noti} />
      ))}
    </ul>
  );
};
