import React from 'react';
import Avatar from './avatar';
import { cn } from '@lib/utils';
import { AvatarData } from '@_mocks/_avatar';

//-----------------------------------------------------------------------------------------

interface AvatarGroupProps {
  avatars: AvatarData[];
  className?: string;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars, className }) => {
  return (
    <div className={`flex `}>
      {avatars.map((avatar) => (
        <Avatar
          key={avatar.id}
          src={avatar.src}
          alt={avatar.alt || 'avatar'}
          avtClassName={cn(
            'border-background-secondary border-2 size-[2rem] ml-[-0.6875rem] object-cover rounded-full',
            className,
          )}
        />
      ))}
    </div>
  );
};

export default AvatarGroup;
