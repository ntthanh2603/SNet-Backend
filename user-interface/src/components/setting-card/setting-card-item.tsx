import { cn } from '@lib/utils';
import { HTMLAttributes } from 'react';

type SettingCardItemProps = HTMLAttributes<HTMLDivElement> & {};

const SettingCardItem = ({ className, children }: SettingCardItemProps) => {
  return (
    <div
      className={cn(
        'flex w-full p-4 border-t border-t-neutral2-2 hover:bg-neutral2-2 items-center justify-between first:rounded-t-[20px] first:border-t-0 last:rounded-b-[20px]',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default SettingCardItem;
