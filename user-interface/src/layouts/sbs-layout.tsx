import useBreakPoint from '@hooks/use-breakpoint';
import React from 'react';
import { Outlet } from 'react-router-dom';

type SBSLProps = {
  sideComponent: React.ReactNode;
};

const SidebySideLayout = ({ sideComponent }: SBSLProps) => {
  const { breakpoint } = useBreakPoint();
  const isLargeScreen =
    breakpoint === 'lg' ||
    breakpoint === 'xl' ||
    breakpoint === '2xl' ||
    breakpoint === '3xl';
  return (
    <div className="h-full flex ">
      <div className="flex-1 h-full overflow-auto no-scrollbar bg-surface">
        {<Outlet />}
      </div>
      {isLargeScreen && (
        <SideWidget
          className={`h-full w-85 transition-all duration-300 ${isLargeScreen ? 'w-85 2xl:w-120' : ''}`}
        >
          {sideComponent}
        </SideWidget>
      )}
    </div>
  );
};

type SideWidgetProps = {
  className?: string;
  children?: React.ReactNode;
};

function SideWidget({ className, children }: SideWidgetProps) {
  return <aside className={className}>{children}</aside>;
}
export default SidebySideLayout;
