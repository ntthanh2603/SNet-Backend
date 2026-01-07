import { AppBar } from '@components/appbar';
import { Avatar } from '@components/avatar';
import { CircleButton } from '@components/button';
import {
  BellIcon,
  BrowserIcon,
  ChevronRight,
  EmailIcon,
  LockIcon,
  NewsIcon,
  NotificationIcon,
  ProtectionIcon,
  QRCodeIcon,
  ThrashIcon,
  TunerIcon,
} from '@components/icons';
import ArrowBack from '@components/icons/arrow-back';
import Bubble from '@components/icons/bubble';
import Bubbles1 from '@components/icons/bubbles1';
import Bubbles2 from '@components/icons/bubbles2';
import Ring1 from '@components/icons/ring1';
import Ring2 from '@components/icons/ring2';
import Ring3 from '@components/icons/ring3';
import ListTile from '@components/list-tile/list-tile';
import { NotificationBanner } from '@components/notification-banner';
import SearchInput from '@components/search-input/search-input';
import { SettingCard, SettingCardItem } from '@components/setting-card';
import { Toggle } from '@components/toggle';
import { Typography } from '@components/typography';
import useBreakPoint from '@hooks/use-breakpoint';
import { paths } from '@routers/path';
import { useNavigate, useSearchParams } from 'react-router-dom';

type Setting = {
  key: string;
  label: string;
  icon: JSX.Element;
  content?: {
    title: string;
    subtile: string;
    status: string;
    avatarUrl: string;
  };
};

const SETTINGS: Setting[] = [
  {
    key: 'account-settings',
    label: 'Account Settings',
    icon: <></>,
    content: {
      title: 'Moyo',
      subtile: '@moyoshiro',
      status: 'Active',
      avatarUrl: 'img/avatar-7.png',
    },
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: (
    <NotificationIcon/>
    ),
  },
];

type SettingsProps = {};

const Settings = ({}: SettingsProps) => {
  const { breakpoint } = useBreakPoint();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get('view');

  const isLargeScreen =
    breakpoint === 'lg' ||
    breakpoint === 'xl' ||
    breakpoint === '2xl' ||
    breakpoint === '3xl';

  const SettingsSection = {
    'account-settings': <AccountsSection />,
    notifications: <NotificationsSection />,
    notfound: (
      <section className="h-full w-full flex items-center justify-center text-tertiary text-base2 font-semibold">
        Not Found
      </section>
    ),
  };

  const settingLabel =
    SETTINGS.find((setting) => setting.key === currentView)?.label ||
    'Settings';

  const showView = () => {
    switch (currentView) {
      case 'account-settings':
        return SettingsSection['account-settings'];
      case 'notifications':
        return SettingsSection.notifications;
      case null:
        return <></>;
      default:
        return SettingsSection.notfound;
    }
  };

  return (
    <div className="h-screen w-full flex relative">
      <div className="grow lg:max-w-[316px] 2xl:max-w-[376px] transition-[max-width] h-full bg-background-secondary p-3 flex flex-col gap-3">
        <section
          id="settings-appbar"
          className="flex items-center justify-between gap-2 w-full min-h-11"
        >
          <CircleButton
            onClick={() => {
              navigate(-1);
            }}
            className="group"
          >
            <ArrowBack className="h-6 w-6 stroke-secondary group-hover:stroke-primary group-active:stroke-primary group-[.disabled]:stroke-tertiary" />
          </CircleButton>
          <SearchInput placeholder="Search settings" />
        </section>
        <ul className="h-full flex-1 flex flex-col gap-2 overflow-auto no-scrollbar">
          {SETTINGS.map((setting) => {
            const isActive = currentView === setting.key;
            if (setting.content) {
              return (
                <ListTile
                  active={isActive}
                  onClick={() =>
                    navigate(`${paths.settings}?view=${setting.key}`, {
                      replace: true,
                    })
                  }
                  key={setting.key}
                >
                  <Avatar
                    src={setting.content.avatarUrl}
                    alt={setting.content.title}
                    isOnline={setting.content.status === 'Active'}
                  />
                  <div className="flex-1 flex flex-col items-start">
                    <Typography
                      level="baser"
                      className="font-medium text-secondary"
                    >
                      {setting.content.title}
                    </Typography>
                    <Typography
                      level="baser"
                      className="font-medium text-xs text-tertiary"
                    >
                      {setting.content.subtile}
                    </Typography>
                  </div>
                  <span
                    className={`${isActive && 'bg-neutral1-5 rounded-full -rotate-90 '} transition-all p-1.5 flex items-center justify-center`}
                  >
                    <ChevronRight />
                  </span>
                </ListTile>
              );
            }
            return (
              <ListTile
                active={isActive}
                onClick={() =>
                  navigate(`${paths.settings}?view=${setting.key}`, {
                    replace: true,
                  })
                }
                key={setting.key}
              >
                <span className="h-11 w-11 p-2.5 rounded-full bg-neutral2-5">
                  {setting.icon}
                </span>
                <Typography
                  level="baser"
                  className="font-medium text-secondary flex-1"
                >
                  {setting.label}
                </Typography>
                <span
                  className={`${isActive && 'bg-neutral1-5 rounded-full -rotate-90 '} transition-all p-1.5 flex items-center justify-center`}
                >
                  <ChevronRight />
                </span>
              </ListTile>
            );
          })}
        </ul>
      </div>
      {isLargeScreen && (
        <div className="flex-1 h-full bg-background p-3 flex flex-col gap-3">
          <AppBar
            title={settingLabel}
            trailing={
              <CircleButton className="py-3 px-6 text-base2 font-semibold text-secondary hover:text-primary">
                Save
              </CircleButton>
            }
          />
          {showView()}
        </div>
      )}
      <section
        className={`fixed z-99 inset-0 h-screen p-3 flex flex-col gap-3 bg-background transition-all duration-300 ${currentView && !isLargeScreen ? ' opacity-100 translate-x-0 ' : ' opacity-0 translate-x-full '}  before:fixed before:inset-0 before:bg-[#313131]`}
      >
        <AppBar
          className="z-1"
          title={settingLabel}
          leading={
            <CircleButton
              onClick={() => navigate(paths.settings, { replace: true })}
              className="group"
            >
              <ArrowBack className=" stroke-secondary group-hover:stroke-primary group-active:stroke-primary group-[.disabled]:stroke-tertiary" />
            </CircleButton>
          }
          trailing={
            <CircleButton className="py-3 px-6 text-base2 font-semibold text-secondary hover:text-primary">
              Save
            </CircleButton>
          }
        />
        {showView()}
      </section>
    </div>
  );
};

export const AccountsSection = () => {
  return (
    <section className="flex-1 flex flex-col h-full gap-3 overflow-auto no-scrollbar">
      <SettingCard className="p-8 gap-7 flex flex-col h-[256px]  items-center justify-center">
        <div className="inline-block relative rounded-full bg-green-200 z-20">
          <img
            id="avatar"
            src="img/avatar-7.png"
            alt=""
            className="rounded-full h-16 w-16 relative z-10"
          />
          <Bubble className="absolute inset-0 right-0 transform -translate-x-1 -translate-y-1" />
          <Bubbles1 className="absolute inset-0 right-0 transform -translate-x-4 translate-y-6" />
          <Bubbles2 className="absolute inset-0 right-0 transform -translate-x-10 -translate-y-10 " />
          <Ring1 className="absolute inset-0 right-0 transform -translate-x-7 -translate-y-7 z-9 " />
          <Ring2 className="absolute inset-0 right-0 transform -translate-x-[50px] -translate-y-12 z-1 " />
          <Ring3 className="absolute inset-0 right-0 transform -translate-x-[70px] -translate-y-12" />
        </div>
        <span className="flex flex-col items-center gap-2">
          <p className="font-rubik font-medium text-title text-primary self-center">
            Moyo Shiro
          </p>
          <p className="text-tertiary opacity-80">moyoshiro@email.com</p>
        </span>
      </SettingCard>
      <SettingCard settingLabel="Account Settings">
        <SettingCardItem className="relative items-center justify-start gap-3 after:absolute after:right-4 after:content-['Change_settings']  after:hidden after:text-sm after:text-secondary after:opacity-80 hover:after:block">
          <EmailIcon />

          <span className="inline-flex gap-2 items-center">
            <Typography level="base2r" className="text-secondary opacity-80">
              Email
            </Typography>
            <Typography level="base2r" className="text-tertiary opacity-80">
              moyoshiro@email.com
            </Typography>
          </span>
        </SettingCardItem>

        <SettingCardItem className="group/item">
          <span className="inline-flex gap-3 items-center">
            <LockIcon />
            <Typography level="base2r" className="text-secondary opacity-80">
              Password
            </Typography>
          </span>
          <button
            id="openForgotPassModal"
            // onclick="createForgotPasswordModal();"
            className="text-secondary font-rubik text-sm opacity-80 group-hover/item:opacity-100 "
          >
            Change
          </button>
        </SettingCardItem>
        <SettingCardItem>
          <span className="inline-flex gap-3 items-center">
            <QRCodeIcon />
            <Typography level="base2r" className="text-secondary opacity-80">
              2FA
            </Typography>
          </span>
          <label className="switch inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer"></input>
            <div className="relative w-11 h-6 p-1 bg-neutral2-5 rounded-full peer peer-checked:after:translate-x-[20px] rtl:peer-checked:after:-translate-x-[20px]  after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-neutral2-30 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral3-50 peer-checked:after:bg-linear-object"></div>
          </label>
        </SettingCardItem>
        <SettingCardItem>
          <span className="inline-flex gap-3 items-center">
            <ThrashIcon />
            <Typography
              level="base2r"
              className=" text-sm text-secondary opacity-80"
            >
              Delete account
            </Typography>
          </span>
        </SettingCardItem>
      </SettingCard>
      <SettingCard settingLabel="Privacy">
        <div className="flex w-full p-4 border-t border-t-neutral2-2 hover:bg-neutral2-2 items-center justify-between">
          <span className="inline-flex gap-3 items-center">
            <LockIcon />
            <Typography
              level="base2r"
              className=" text-sm text-secondary opacity-80"
            >
              Private profile
            </Typography>
          </span>
          <label className="switch inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="relative w-11 h-6 p-1 bg-neutral2-5 rounded-full peer peer-checked:after:translate-x-[20px] rtl:peer-checked:after:-translate-x-[20px]  after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-neutral2-30 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral3-50 peer-checked:after:bg-linear-object"></div>
          </label>
        </div>
        <div className="flex w-full p-4 border-t border-t-neutral2-2  hover:bg-neutral2-2 justify-between items-center group/item">
          <span className="inline-flex gap-3 items-center">
            <ProtectionIcon />
            <Typography
              level="base2r"
              className=" text-sm text-secondary opacity-80"
            >
              Cookie settings
            </Typography>
          </span>
          <span className="flex gap-1 opacity-80 items-center">
            <Typography
              level="base2r"
              className=" text-sm text-secondary opacity-80"
            >
              Customize
            </Typography>

            <TunerIcon />
          </span>
        </div>
        <div className="flex w-full p-4 border-t border-t-neutral2-2  hover:bg-neutral2-2 justify-between items-center group/item">
          <span className="inline-flex gap-3 items-center">
            <ProtectionIcon />
            <Typography
              level="base2r"
              className=" text-sm text-secondary opacity-80"
            >
              Direct messages
            </Typography>
          </span>
          <span className="flex gap-1 opacity-80 items-center">
            <Typography
              level="baser"
              className=" text-sm text-secondary opacity-80"
            >
              Everyone
            </Typography>

            <TunerIcon />
          </span>
        </div>
      </SettingCard>
    </section>
  );
};

export const NotificationsSection = () => {
  return (
    <section className="flex-1 flex flex-col h-full gap-3 overflow-auto no-scrollbar">
      <NotificationBanner />
      <SettingCard>
        <SettingCardItem>
          <span className="inline-flex gap-3 items-center">
            <EmailIcon />
            <p className="text-secondary font-rubik text-sm opacity-80">
              Email
            </p>
          </span>
          <Toggle defaultChecked />
        </SettingCardItem>
        <SettingCardItem>
          <span className="inline-flex gap-3 items-center">
            <svg
              className="h-6 w-6 stroke-secondary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9.75 19.25H14.25M8.75 22.25H15.25C16.9069 22.25 18.25 20.9069 18.25 19.25V4.75C18.25 3.09315 16.9069 1.75 15.25 1.75H8.75C7.09315 1.75 5.75 3.09315 5.75 4.75V19.25C5.75 20.9069 7.09315 22.25 8.75 22.25Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-secondary font-rubik text-sm opacity-80">SMS</p>
          </span>
          <Toggle />
        </SettingCardItem>
        <SettingCardItem>
          <span className="inline-flex gap-3 items-center">
            <BrowserIcon />
            <p className="text-secondary font-rubik text-sm opacity-80">
              Browser
            </p>
          </span>
          <Toggle />
        </SettingCardItem>
      </SettingCard>
      <SettingCard>
        <SettingCardItem>
          <span className="inline-flex gap-3 items-center">
            <NewsIcon/>
            <p className="text-secondary font-rubik text-sm opacity-80">
              News ands Programs
            </p>
          </span>
          <Toggle />
        </SettingCardItem>
        <SettingCardItem>
          <span className="inline-flex gap-3 items-center">
            <BellIcon/>
            <p className="text-secondary font-rubik text-sm opacity-80">
              Product updates
            </p>
          </span>
          <Toggle />
        </SettingCardItem>
      </SettingCard>
    </section>
  );
};

export const PreferencesSection = () => {
  return <section></section>;
};

export const BlockedAccountsSection = () => {
  return <section></section>;
};

export const ContactSupport = () => {
  return <section></section>;
};

export default Settings;
