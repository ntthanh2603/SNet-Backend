import { cn } from "@lib/utils";
import { ReactNode } from "react";

interface CircleAvatarProps {
    upperItem?: ReactNode;
    path: string;
    className?: string;
  }
  
  export const CircleAvatar: React.FC<CircleAvatarProps> = ({
    path,
    upperItem,
    className,
  }) => {
    return (
      <div className={cn('relative h-11 w-11', className)}>
        <img
          src={path}
          alt="thumbnail"
          className="h-full w-full rounded-full object-cover"
        />
        {upperItem && (
          <div className="absolute -bottom-1 -right-1 rounded-full p-0.5 bg-[#313131]">
            {upperItem}
          </div>
        )}
      </div>
    );
  };