import { Typography } from "@components/typography";

type Props = {
  content?: string | number;
};

const Badge = ({ content }: Props) => {
  if (content) {
    return (
      <div className=" translate-x-1 `translate-y-1 relative p-[1px] bg-linear-red rounded-full before:content-[''] before:absolute before:inset-0 before:opacity-75 before:bg-linear-card before:rounded-full">
        <div className="rounded-full p-1 bg-linear-red h-5 w-5 flex items-center justify-center shadow-button backdrop-blur-16">
          <Typography level="smallsm" className="text-secondary">{content}</Typography>
        </div>
      </div>
    );
  }
  return (
    <div className="m-1 relative p-[1px] bg-linear-red h-2 w-2 rounded-full before:content-[''] before:absolute before:inset-0 before:opacity-75 before:bg-linear-card before:rounded-full">
      <div className="rounded-full p-1 bg-linear-red  flex items-center justify-center shadow-button backdrop-blur-16">
      </div>
    </div>
  );
};

export default Badge;
