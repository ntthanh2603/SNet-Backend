import useBreakPoint from '@hooks/use-breakpoint';
import BottomNavigationBar from '@layouts/components/bottom-navigation-bar';
import Sidebar from '@layouts/components/sidebar';
import eventBus from '@utils/event-emitter';
import React from 'react';
import { Outlet } from 'react-router-dom';

//-------------------------------------------------------------------------

type Props = {};

const MainLayout = ({}: Props) => {
  const { breakpoint } = useBreakPoint();
  const [isPostShow, setIsPostShow] = React.useState(false);

  React.useEffect(() => {
    const handleToggle = (status: boolean) => {
      setIsPostShow(status);
    };

    eventBus.on('isShowCreatePost', handleToggle);

    return () => {
      eventBus.off('isShowCreatePost', handleToggle);
    };
  }, []);

  return (
    <>
      <div id="" className="h-fit block md:flex">
        {breakpoint !== 'sm' && <Sidebar />}
        <main className="flex-1 flex-grow w-full min-h-fit overflow-hidden">
          <Outlet />
        </main>
        {breakpoint === 'sm' && !isPostShow && <BottomNavigationBar />}
      </div>
    </>
  );
};

export default MainLayout;
