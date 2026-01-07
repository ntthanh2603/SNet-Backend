import { Typography } from '@components/typography';
import { cn } from '@lib/utils';
import React from 'react';

type AppBarProps = {
  leading?: React.ReactNode;
  title?: string;
  trailing?: React.ReactNode;
  leadingWidth?: number;
  trailingWidth?: number;
  className?: string;
};

const AppBar: React.FC<AppBarProps> = ({
  leading,
  leadingWidth,
  trailingWidth,
  title,
  trailing,
  className,
}) => {
  return (
    <section className={cn('w-full min-h-11 gap-2 flex justify-between items-center',className)}>
      <span className=" flex-1 gap-3 inline-flex items-center justify-start">
        {leading && (
          <span
            className={`${leadingWidth ? `w-[${leadingWidth}px]` : 'w-fit'} inline-flex items-center justify-center`}
          >
            {leading}
          </span>
        )}
        <Typography level="title" className="text-secondary select-none">
          {title}
        </Typography>
      </span>
      {trailing && (
        <span
          className={`${trailingWidth ? `w-[${trailingWidth}px]` : 'w-fit'} inline-flex items-center justify-center`}
        >
          {trailing}
        </span>
      )}
    </section>
  );
};

export default AppBar;
