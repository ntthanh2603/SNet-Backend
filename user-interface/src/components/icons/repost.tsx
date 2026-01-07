//--------------------------------------------------------------------------
interface RepostProps {
  isActive: boolean;
}

export default function Repost({ isActive }: RepostProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      className="cursor-pointer"
    >
      <g opacity="0.8">
        <path
          d="M5.4165 13.25V8.75C5.4165 7.09315 6.75965 5.75 8.4165 5.75H15.7736M13.3122 2.75L16.4194 5.75L13.3122 8.75M19.9165 10.75V15.25C19.9165 16.9069 18.5734 18.25 16.9165 18.25H9.55936M12.0208 21.25L8.91365 18.25L12.0208 15.25"
          stroke={isActive ? '#7cffb0b2' : '#F8F8F8'}
          strokeOpacity={isActive ? '1' : '0.5'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
