import { CircleButton } from '@components/button';
import { Typography } from '@components/typography';
import { cn } from '@lib/utils';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from './navigation-items';
import NavigationBar from './navigationbar';
import { Logo } from '@components/icons';
import CloseIcon from '@components/icons/close';
import { Avatar } from '@components/avatar';
import SettingSlider from '@components/icons/setting-slider';
import Leave from '@components/icons/leave';

//-------------------------------------------------------------------------

type MobileSidebarProps = {
  className?: string;
  onClose: () => void;
};

const USER = {
  name: 'Kohaku',
  email: '@kohaku',
  avatar: '/img/avatar-7.png',
  status: 'online',
};

const MobileSidebar = ({ onClose, className }: MobileSidebarProps) => {
  const navItems = NAVIGATION_ITEMS;
  return (
    <section
      className={cn(
        'md:hidden flex flex-col fixed z-99 inset-0 bg-background-secondary before:fixed before:z-0 before:inset-0 before:bg-[#313131]',
        className,
      )}
    >
      <div className="flex w-full  justify-between p-3">
        <div className="z-99 h-11 w-11 relative">
          <Logo />
        </div>
        <CircleButton onClick={onClose}>
          <CloseIcon />
        </CircleButton>
      </div>
      <NavigationBar
        expanded={true}
        navigationItems={navItems}
        className="flex-1 px-3"
      />
      <div
        id="account"
        className="p-3 flex flex-col gap-2 items-center justify-center"
      >
        <div className="flex p-1.5 gap-3 w-full items-center justify-center">
          <Avatar
            src={USER.avatar}
            alt={USER.name}
            isOnline={USER.status === 'online'}
          />

          <div className="flex flex-1 items-center bg-red-100">
            <span className="flex-grow">
              <Typography
                level="base2sm"
                className="text-secondary opacity-80 select-none"
              >
                {USER.name}
              </Typography>
              <br />
              <Typography
                level="captionr"
                className="text-tertiary opacity-45 select-none"
              >
                {USER.email}
              </Typography>
            </span>
            <span className="p-1 inline-flex gap-1 z-9">
              <NavLink to="/settings?view=account-settings" className={'p-2.5'}>
                <SettingSlider className="h-6 w-6 stroke-secondary hover:stroke-primary"></SettingSlider>
              </NavLink>
              <NavLink to="/login" className={'p-2.5'}>
                <Leave className="h-6 w-6 stroke-secondary hover:stroke-primary" />
              </NavLink>
            </span>
          </div>
        </div>
        <CircleButton
          className={'px-6 py-3 w-full'}
          onClick={() => {
            // TODO: create new post
          }}
        >
          <Typography level="base2sm" className="text-secondary select-none">
            Post
          </Typography>
        </CircleButton>
      </div>
    </section>
  );
};

export default MobileSidebar;
