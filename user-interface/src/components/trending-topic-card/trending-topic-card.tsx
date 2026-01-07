import { Typography } from '@components/typography';
import { cn } from '@lib/utils';

interface TrendingTopicCardProps {
  className?: string;
  trendingName: string;
  time: string;
  isNew?: boolean;
  thumbnail: string;
}

export default function TrendingTopicCard({
  className,
  trendingName,
  time,
  isNew,
  thumbnail,
}: TrendingTopicCardProps) {
  return (
    <div
      className={cn(
        'relative bg-neutral2-2 rounded-[1.25rem] p-3 flex items-center gap-4 hover:bg-neutral2-5 focus:border-[3px] focus:border-neutral2-10',
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={`${isNew ? `absolute top-[0.5rem] right-[0.5rem]` : 'hidden'}`}
      >
        <circle cx="12" cy="12" r="6" fill="#55F08B" />
      </svg>
      <img
        src={thumbnail}
        alt="trending thumbnail"
        className="min-w-[7rem] max-h-[6rem] rounded-[0.5rem] object-cover row-span-2 items-center"
      />
      <div className="flex flex-col gap-3">
        <Typography level="base2sm" className=" text-primary opacity-80">
          {trendingName}
        </Typography>
        <div className="flex items-center justify-start gap-3">
          <div
            id="avatar-user-group"
            className="flex w-fit justify-start items-start"
          >
            <img
              src="https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg"
              alt="Avatar 3"
              className="border-[#2e2e2e] border-[0.0625rem] size-[1.25rem] object-cover rounded-full"
            />
            <img
              src="https://i.pinimg.com/originals/4a/7e/74/4a7e7438c14c2807c81cba4a99e4cec2.jpg"
              alt="Avatar 5"
              className="border-[#2e2e2e] border-[0.0625rem] size-[1.25rem] ml-[-0.275rem] object-cover rounded-full"
            />
            <img
              src="https://i.pinimg.com/originals/14/ab/f1/14abf1f58ea5686cf9e24ec22a099892.jpg"
              alt="Avatar 9"
              className="border-[#2e2e2e] border-[0.0625rem] size-[1.25rem] ml-[-0.275rem] object-cover rounded-full"
            />
          </div>
          <Typography level="captionr" className="opacity-45 text-tertiary">
            {time} hours ago
          </Typography>
        </div>
      </div>
    </div>
  );
}
