import Avatar from '@components/avatar/avatar';
import { Typography } from '@components/typography';

//----------------------------------------------------------------------

interface IMessageItemProps {
  message: IMessage;
}

interface IMessage {
  user: {
    avatarUrl: string;
    name: string;
  };
  content: string;
  imageUrl?: string;
  time: string;
}

export default function MessageItem({ message }: IMessageItemProps) {
  return (
    <div className="w-full flex items-start justify-start gap-4 rounded-[1.25rem] p-3 bg-neutral2-2">
      <Avatar src={message.user.avatarUrl} alt="avatar-user" />

      <div className="grow flex flex-col gap-2">
        <div className="flex items-center">
          <Typography
            level="base2m"
            className="text-primary opacity-80 flex items-center gap-2"
          >
            {message.user.name}
            <Typography level="captionr" className="text-tertiary opacity-50">
              {message.time}
            </Typography>
          </Typography>
        </div>
        <Typography level="body2r" className="text-secondary opacity-80">
          {message.content}
        </Typography>
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            loading="lazy"
            className="max-h-[22.5rem] w-full md: rounded-[1.5rem] object-cover"
          />
        )}
      </div>
    </div>
  );
}
