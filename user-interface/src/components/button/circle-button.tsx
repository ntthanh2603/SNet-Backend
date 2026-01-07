import { cn } from '@lib/utils';
import { HTMLAttributes } from 'react';
//--------------------------------------------------------------------------

type CircleButtonProps = HTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  disabled?: boolean;
};

const CircleButton = ({
  className,
  children,
  disabled,
  ...props
}: CircleButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        className,
        `relative p-[1.5px] bg-neutral3-70 select-none cursor-pointer ${disabled ? 'pointer-events-none disabled ' : ' active:bg-neutral3-90 hover:bg-linear-hover '} rounded-[32px] before:content-[''] before:absolute before:inset-0 before:opacity-25 before:bg-linear-card before:rounded-[32px] after:content-[''] after:absolute after:inset-[1.5px] after:bg-[#313131] after:rounded-[30.5px]`,
      )}
    >
      <span
        className={cn(
          `relative z-10 flex justify-center items-center w-full h-full bg-neutral3-70 ${disabled ? '' : 'hover:bg-linear-hover active:bg-neutral3-90'}  rounded-button p-[8.5px] shadow-button backdrop-blur-50`,
          className,
        )}
      >
        {children}
      </span>
    </button>
  );
};

export default CircleButton;
