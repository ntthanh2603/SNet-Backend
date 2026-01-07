import { cn } from '@lib/utils';

export default function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('w-6 h-6 stroke-secondary ', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="bubble 7 text, message" opacity="0.8">
        <path
          id="Icon"
          d="M15.25 9.75H8.75M12.25 14.25H8.75M2.75 20.25H16.25C19.0114 20.25 21.25 18.0114 21.25 15.25V8.75C21.25 5.98858 19.0114 3.75 16.25 3.75H7.75C4.98858 3.75 2.75 5.98858 2.75 8.75V20.25Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
