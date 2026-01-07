import { cn } from '@lib/utils';

export default function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-3 w-3 stroke-secondary', className)}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="chevron-right-icon">
        <path
          id="chevron-right-icon-svg"
          d="M4 5L5.46967 6.46967C5.76256 6.76256 6.23744 6.76256 6.53033 6.46967L8 5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
