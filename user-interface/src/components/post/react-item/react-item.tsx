import { Typography } from '@components/typography';
import { cn } from '@lib/utils';

//--------------------------------------------------------------------------------------------------------

interface ReactItemProps {
  value: number;
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ReactItem({
  value,
  icon,
  className,
  onClick,
}: ReactItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn('flex items-center gap-1.5 px-3 py-1.5', className)}
    >
      {icon}
      <Typography level="captionsm" className="opacity-80 text-secondary">
        {value}
      </Typography>
    </div>
  );
}
