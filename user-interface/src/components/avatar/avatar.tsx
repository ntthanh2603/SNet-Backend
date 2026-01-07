import { cn } from '@lib/utils';
import React from 'react';
import { OnlineIcon, OfflineIcon } from '@components/icons';

//-------------------------------------------------------------------------

interface AvatarProps {
  src: string;
  alt?: string;
  avtClassName?: string;
  isOnline?: boolean;
  onlineClassName?: string;
}

interface OnlineStatusProps {
  isOnline: boolean;
  className?: string;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ isOnline, className }) => (
  <div
    className={cn(
      'absolute size-[1.25rem] -left-1 -top-1 rounded-full bg-neutral3-80 border-[0.1875rem] border-neutral3-80 flex items-center justify-center',
      className,
    )}
  >
    {isOnline ? <OnlineIcon /> : <OfflineIcon />}
  </div>
);

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'avatar',
  isOnline,
  onlineClassName,
  avtClassName,
}) => (
  <div className="relative">
    {isOnline !== undefined && (
      <OnlineStatus isOnline={isOnline} className={onlineClassName} />
    )}
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn(
        'rounded-full min-w-[2.75rem] size-[2.75rem] object-cover',
        avtClassName,
      )}
    />
  </div>
);

export default Avatar;
