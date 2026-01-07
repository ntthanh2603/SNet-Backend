import { cn } from '@lib/utils';
import { HTMLAttributes } from 'react';
//--------------------------------------------------------------------------

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  child: React.ReactNode;
  filled?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'submit' | 'button' | 'reset';
};

const Button = ({
  className,
  child,
  disabled,
  filled,
  type,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={`relative p-[1.5px] bg-neutral3-70 ${disabled ? 'pointer-events-none opacity-50' : ' active:bg-neutral3-90 hover:bg-linear-hover opacity-100'} rounded-button before:content-[''] before:absolute before:inset-0 before:opacity-25 before:bg-linear-card before:rounded-full after:content-[''] after:absolute after:inset-[1.5px] after:bg-[#313131] after:rounded-full`}
    >
      <span
        className={cn(
          `relative z-10 flex justify-center items-center w-full h-full bg-neutral3-70 ${disabled ? '' : 'hover:bg-linear-hover active:bg-neutral3-90'}  rounded-button p-[8.5px] shadow-button backdrop-blur-50`,
          className,
        )}
      >
        {child}
      </span>
    </button>
  );
};

export default Button;
