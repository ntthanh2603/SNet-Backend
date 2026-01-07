import { Typography } from '@components/typography';
import React from 'react';

interface ToggleItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`flex-1 flex justify-center items-center font-semibold cursor-pointer px-6 py-2 h-full ${
        isActive ? 'rounded-[100px] bg-neutral2-5 shadow-toggle' : ''
      }`}
      onClick={onClick}
    >
      <Typography
        level="base2sm"
        className={`opacity-80 text-secondary ${isActive ? 'text-primary opacity-100' : ''}`}
      >
        {label}
      </Typography>
    </button>
  );
};

export default ToggleItem;
