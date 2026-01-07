import { cn } from '@lib/utils';

type ListTileProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};

const ListTile = ({ children, className, onClick, active }: ListTileProps) => {
  return (
    <li
      className={`relative z-0 ${active ? 'bg-neutral2-10' : 'bg-neutral2-2'} rounded-[20px] before:content-[''] before:absolute before:inset-0 before:z-1 before:opacity-15 before:bg-linear-card before:rounded-[20px] after:content-[''] after:absolute after:inset-[1px] after:z-1 after:bg-[#313131] after:rounded-[19px]`}
    >
      <div
        onClick={onClick}
        className={cn(
          `relative z-9 p-3 gap-4 w-full flex items-center rounded-[20px] ${active ? 'bg-neutral2-10 hover:bg-neutral2-5 active:bg-neutral3-20' : 'bg-neutral2-2 hover:bg-neutral2-5 active:bg-neutral3-20'} select-none cursor-pointer transition-colors duration-200 ease-in-out`,
          className,
        )}
      >
        {children}
      </div>
    </li>
  );
};

export default ListTile;
