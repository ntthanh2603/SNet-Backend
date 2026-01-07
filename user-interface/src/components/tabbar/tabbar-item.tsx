import { Typography } from '@components/typography';

interface TabBarItemProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

const TabBarItem: React.FC<TabBarItemProps> = ({
  isActive,
  label,
  onClick,
}) => {
  return (
    <button
      className={`flex-1 font-semibold flex justify-center cursor-pointer p-[1.5px] ${
        isActive ? 'rounded-[100px] bg-stroke25 shadow-toggle' : ''
      }`}
      onClick={onClick}
    >
      <Typography
        level="base2sm"
        className={`select-none opacity-80 w-full h-full rounded-[100px] px-[22.5px] py-[6.5px] text-center ${isActive ? 'text-primary opacity-100 bg-neutral2-5' : 'text-secondary'}`}
      >
        {label}
      </Typography>
    </button>
  );
};

export default TabBarItem;
