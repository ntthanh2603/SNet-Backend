import React from 'react';
import { Typography } from '@components/typography';
import AvatarGroup from './avatar-group';
import { AvatarData } from '@_mocks/_avatar';

//-----------------------------------------------------------------------------------------
interface ExpandButtonProps {
  count: string;
}

interface AvtGroupExpandProps {
  count: string;
  avatars: AvatarData[];
  className?: string;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({ count }) => (
  <div className="ml-[-11px] rounded-[1.25rem] border-[#2e2e2e] border-[2px] bg-neutral2-5 px-3 py-1.5 base text-sm text-secondary font-semibold backdrop-blur-[16px]">
    <Typography level="base2m" className="text-secondary">
      {`${count}+`}
    </Typography>
  </div>
);

const AvtGroupExpand: React.FC<AvtGroupExpandProps> = ({
  count,
  avatars,
  className,
}) => {
  return (
    <div className="relative flex w-full justify-center">
      <AvatarGroup avatars={avatars} className={className} />
      <ExpandButton count={count} />
    </div>
  );
};

export default AvtGroupExpand;
