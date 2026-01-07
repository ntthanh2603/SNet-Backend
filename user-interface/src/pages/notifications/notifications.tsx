import { NOTIFICATIONS } from '@_mocks/_notifications';
import { AppBar } from '@components/appbar';
import { CircleButton } from '@components/button';
import Tabbar from '@components/tabbar/tabbar';
import useBreakpoint from '@hooks/use-breakpoint';
import { useEffect, useMemo, useState } from 'react';
import { NotificationList } from './components/notification-list';
import { Notification, NotificateAction } from '../../types/notification';
import { useNavigate } from 'react-router-dom';
import { paths } from '@routers/path';

const TABITEMS = [
  { key: 'all', label: 'All' },
  { key: 'likes', label: 'Likes' },
  { key: 'replies', label: 'Replies' },
  { key: 'follows', label: 'Follows' },
];

interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = ({}) => {
  const { breakpoint } = useBreakpoint();
  const [activeTab, setActiveTab] = useState(() => TABITEMS[0].key);
  const [notification, setNotification] = useState<Notification[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    setNotification(NOTIFICATIONS);
  }, []);

  const isSmallScreen = breakpoint === 'sm';
  const filteredNotification = useMemo(() => {
    switch (activeTab) {
      case 'all':
        return notification;
      case 'likes':
        return notification.filter((n) => n.action === NotificateAction.like);
      case 'replies':
        return notification.filter(
          (n) => n.action === NotificateAction.comment,
        );
      case 'follows':
        return notification.filter((n) => n.action === NotificateAction.follow);
      default:
        return notification;
    }
  }, [activeTab, notification]);

  const tabs = useMemo(() => {
    if (isSmallScreen) {
      return TABITEMS.filter((tab) => tab.key !== 'replies');
    }
    return TABITEMS;
  }, [breakpoint]);

  const handleChangeTab = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  return (
    <section
      className={`relative min-w-full flex-1 h-screen flex flex-col gap-3 p-3 ${isSmallScreen ? 'after:h-[112px] before:mb-[80px]' : ''}  before:absolute before:z-1 before:bottom-0 before:left-0 before:right-0  before:pointer-events-none before: before:h-[100px] before:bg-gradient-to-b before:from-[rgba(40,40,40,0)] before:to-[#313131]`}
    >
      <AppBar
        leading={
          <CircleButton
            className="group"
            onClick={() => {
              navigate(-1);
            }}
          >
            <svg
              className="h-6 w-6 stroke-secondary group-hover:stroke-primary group-active:stroke-primary group-[.disabled]:stroke-tertiary"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="arrow-left" opacity="0.8">
                <path
                  id="Icon"
                  d="M8.75345 18.2461L4.62478 14.1174C3.4532 12.9459 3.4532 11.0464 4.62477 9.87479L8.75345 5.74609M4.25345 11.9961L20.2535 11.9961"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </CircleButton>
        }
        title={'Notifications'}
        trailing={
          <CircleButton
            className="group"
            onClick={() => {
              navigate(`${paths.settings}?view=notifications`);
            }}
          >
            <svg
              className="h-6 w-6 stroke-secondary group-hover:stroke-primary group-active:stroke-primary group-[.disabled]:stroke-tertiary"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="settings slider hor" opacity="0.8">
                <path
                  id="Icon"
                  d="M13.75 7H3.75M13.75 7C13.75 5.20437 15.2044 3.75 17 3.75C18.7956 3.75 20.25 5.20437 20.25 7C20.25 8.79563 18.7956 10.25 17 10.25C15.2044 10.25 13.75 8.79563 13.75 7ZM20.25 17H12.25M12.25 17C12.25 18.7956 10.7956 20.25 9 20.25C7.20438 20.25 5.75 18.7956 5.75 17M12.25 17C12.25 15.2044 10.7956 13.75 9 13.75C7.20438 13.75 5.75 15.2044 5.75 17M5.75 17H3.75"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </CircleButton>
        }
      />
      <Tabbar tabs={tabs} activeTab={activeTab} onTabChange={handleChangeTab} />
      <NotificationList notifications={filteredNotification} />
    </section>
  );
};

export default Notifications;
