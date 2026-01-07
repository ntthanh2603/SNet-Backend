import { Avatar } from '@components/avatar';
import { BookmarkIcon } from '@components/icons';
import { Typography } from '@components/typography';

//----------------------------------------------------------------------

export default function BMPostItem({ post }: any) {
  return (
    <div className="w-full flex flex-col rounded-[1.25rem] p-3 bg-neutral2-2 gap-3 cursor-pointer">
      <div className="flex items-start gap-5">
        <Avatar
          alt="avatar"
          src={
            post.user.avatar ||
            'https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg'
          }
          avtClassName="rounded-full min-w-[2.75rem] size-[2.75rem] object-cover"
        />
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-items-auto items-center">
            <Typography
              level="base2m"
              className="text-primary justify-self-start opacity-80 mr-4"
            >
              {post.user?.name}
            </Typography>
            <Typography
              level="captionr"
              className="text-tertiary justify-self-start grow opacity-45"
            >
              {post.user?.time}
            </Typography>

            <BookmarkIcon width={24} height={24} />
          </div>
          <Typography
            dangerouslySetInnerHTML={{ __html: post.content?.text }}
            level="body2r"
            className="text-secondary opacity-80"
          />

          {post.content?.image && (
            <img
              src={post.content.image}
              alt="post-image"
              loading="lazy"
              className="max-h-[12.5rem] md:max-h-[19rem] w-full rounded-[1.5rem] object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
