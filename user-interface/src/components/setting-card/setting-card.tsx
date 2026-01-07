import { Typography } from '@components/typography';
import { cn } from '@lib/utils';
import React from 'react';

type SettingCardProps = {
  className?: string;
  settingLabel?: string;
  children?: React.ReactNode;
};

const SettingCard = ({
  className,
  settingLabel,
  children,
}: SettingCardProps) => {
  const [expanded, setExpanded] = React.useState(true);
  return (
    <div className="relative z-0 before:content-[''] before:absolute before:inset-0 before:z-1 before:opacity-15 before:bg-linear-card before:rounded-[20px] after:content-[''] after:absolute after:inset-[1.5px] after:z-1 after:bg-[#313131] after:rounded-[18.5px]">
      <div
        className={cn(
          `relative z-9 flex flex-col items-start self-stretch rounded-[20px] bg-neutral2-2 transition-all duration-200 ease-in-out ${expanded ? 'max-h-full' : 'max-h-10'} first:rounded-t-[20px] last:rounded-b-[20px]`,
          className,
        )}
      >
        {settingLabel && (
          <div
            onClick={() => setExpanded(!expanded)}
            className="flex w-full px-4 py-2.5 items-center cursor-pointer"
          >
            <Typography
              level="hairline1"
              className="flex-1 text-tertiary capitalize"
            >
              {settingLabel}
            </Typography>
            <svg
              className={`h-6 w-6 stroke-tertiary hover:stroke-secondary ${expanded || 'transform rotate-180'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g opacity="0.5">
                <path
                  d="M8 14L10.9393 11.0607C11.5251 10.4749 12.4749 10.4749 13.0607 11.0607L16 14"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        )}
        {expanded && children}
      </div>
    </div>
  );
};

export default SettingCard;
