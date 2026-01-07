import { Avatar } from '@components/avatar';
import CircleButton from '@components/button/circle-button';
import Left from '@components/button/left';
import { AddIcon, Logo, MoreIcon } from '@components/icons';
import ExpandControl from '@components/icons/expand-control';
import Leave from '@components/icons/leave';
import SettingSlider from '@components/icons/setting-slider';
import { Typography } from '@components/typography';
import useBreakPoint from '@hooks/use-breakpoint';
import CreatPost from '@pages/home/creat-post';
import { paths } from '@routers/path';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from './navigation-items';
import NavigationBar from './navigationbar';
import { useUsersControllerGetAccount } from '@services/apis/gen/queries';

//-------------------------------------------------------------------------

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const { breakpoint } = useBreakPoint();
  const [isCreatePost, setIsCreatePost] = useState(false);

  const { data: userData } = useUsersControllerGetAccount({
    query: {
      retry: false,
    },
  });
  const user = (userData as any)?.data;

  const navItems = NAVIGATION_ITEMS;

  useEffect(() => {
    if (breakpoint === 'sm' || breakpoint === 'md' || breakpoint === 'lg') {
      if (isExpanded === true) {
        setIsExpanded(!isExpanded);
      }
    } else {
      if (isExpanded === false) {
        setIsExpanded(!isExpanded);
      }
    }
  }, [breakpoint]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isCreatePost) {
        setIsCreatePost(false);
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isCreatePost]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMoreOptions = () => {
    setIsMoreOptions(!isMoreOptions);
  };

  const handleCreatePost = () => {
    setIsCreatePost(!isCreatePost);
  };

  return (
    <>
      {/* Underlayer */}
      <div
        id="underlay"
        className={`hidden md:block min-h-full transition-all duration-300 ${
          isExpanded ? 'w-70 2xl:w-80' : 'w-18'
        }`}
      />
      {/* Sidebar */}
      <aside
        className={`hidden md:flex group/sidebar md:flex-col min-h-full fixed z-1 top-0 left-0  bg-surface-3 text-white transition-all duration-300 ${
          isExpanded ? 'w-70 2xl:w-80 ' : 'w-18'
        }`}
      >
        <section className="w-full flex justify-between items-center p-3">
          <div className=" h-11 w-11 relative">
            {/* Logo with size 44px */}
            <Logo
              className={` mx-auto  transition-all duration-500 transform ${
                isExpanded
                  ? 'opacity-100 translate-x-0'
                  : 'group-hover/sidebar:-translate-x-5 group-hover/sidebar:opacity-0'
              }`}
            />
            {/* Expand/Collapse Button */}
            {!isExpanded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CircleButton
                  className={`group transition-all duration-500 transform group-hover/sidebar:translate-x-0 group-hover/sidebar:opacity-100  ${
                    isExpanded ? 'opacity-0' : 'translate-x-5 opacity-0'
                  }`}
                  onClick={toggleSidebar}
                >
                  <Left className="h-6 w-6 stroke-secondary group-hover:stroke-primary group-active:stroke-primary group-[.disabled]:stroke-tertiary" />
                </CircleButton>
              </div>
            )}
          </div>
          {isExpanded && (
            <CircleButton onClick={toggleSidebar}>
              <ExpandControl className="h-6 w-6 fill-secondary group-hover:fill-primary group-active:fill-primary group-[.disabled]:fill-tertiary" />
            </CircleButton>
          )}
        </section>

        {/* Sidebar content (add your navigation links here) */}
        <section id="navigation" className="p-3 flex-1">
          <NavigationBar
            expanded={isExpanded}
            navigationItems={navItems}
            className="flex-1"
          />
        </section>
        <section
          id="account"
          className="p-3 flex flex-col gap-2 items-center justify-center"
        >
          <div
            onClick={toggleMoreOptions}
            className={`relative z-20 flex p-1.5 gap-3 w-full items-center justify-center backdrop-blur-16  hover:bg-neutral1-5 active:bg-neutral4-30 ${isExpanded ? 'rounded-xl' : 'rounded-full '}`}
          >
            <Avatar
              src={user?.avatar || '/img/avatar-default.png'}
              alt={user?.username}
              isOnline={true}
              avtClassName="h-8 w-8"
            />

            {isExpanded && (
              <div className="flex flex-1 items-center">
                <span className="flex-grow">
                  <Typography
                    level="base2sm"
                    className="text-secondary opacity-80 select-none"
                  >
                    {user?.username}
                  </Typography>
                  <br />
                  <Typography
                    level="captionr"
                    className="text-tertiary opacity-45 select-none"
                  >
                    @{user?.username}
                  </Typography>
                </span>
                <span className="p-1">
                  <MoreIcon />
                </span>
              </div>
            )}
            {isMoreOptions && (
              <>
                <div className="absolute -top-[96px] right-0 z-50 mr-0.5 bg-neutral2-5 rounded-[32px] shadow-dropup border border-neutral1-20">
                  <NavLink to={`${paths.settings}?view=account-settings`}>
                    <div className="h-12 z-50 flex p-2 items-center rounded-t-[32px] bg-neutral1-0 hover:bg-neutral1-5 backdrop-blur-16">
                      <SettingSlider />
                    </div>
                  </NavLink>
                  <NavLink to="/login">
                    <div className="h-12 z-50 flex p-2 items-center rounded-b-[32px] bg-neutral1-0 hover:bg-neutral1-5 backdrop-blur-16">
                      <Leave />
                    </div>
                  </NavLink>
                </div>
              </>
            )}
          </div>
          <CircleButton
            className={`${isExpanded && 'px-6 py-3 w-full'}`}
            onClick={() => {
              handleCreatePost();
            }}
          >
            {isExpanded ? (
              <Typography
                level="base2sm"
                className="text-secondary select-none"
              >
                Post
              </Typography>
            ) : (
              <AddIcon />
            )}
          </CircleButton>
          <p className="text-text-secondary text-[10px] text-center">
            Code by{' '}
            <a target="_blank" href="https://200lab.io/">
              @<span className="text-[#278e4f]">200</span>
              <span className="text-[#2170a1]">Lab</span>
            </a>
          </p>
          {isMoreOptions && (
            <div
              className="fixed inset-0 z-10"
              onClick={toggleMoreOptions}
            ></div>
          )}
        </section>
      </aside>
      {isCreatePost && <CreatPost onBack={handleCreatePost} />}
    </>
  );
};

export default Sidebar;
