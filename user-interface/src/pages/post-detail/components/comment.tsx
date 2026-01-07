import React from 'react';
import {
  BookmarkIcon,
  CommentIcon,
  HeartIcon,
  MoreIcon,
  RepostIcon,
  ShareIcon,
} from '@components/icons';
import { Typography } from '@components/typography';
import LineComment from './line-comment';
import { ReactItem } from '@components/post/react-item';

//--------------------------------------------------------------------------------------------------------

export default function Comment({ comment, isLast }: any) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isRecommented, setIsRecommented] = React.useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleRecommentClick = () => {
    setIsRecommented(!isRecommented);
  };

  return (
    <div className="w-full p-3 flex flex-col gap-3 relative">
      <div className="flex justify-start items-start gap-5">
        <img
          src={
            comment.user?.avatar ||
            'https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg'
          }
          alt="avatar-user"
          className="rounded-full min-w-[2.75rem] size-[2.75rem] object-cover"
        />
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-items-auto items-center">
            <Typography
              level="base2m"
              className="text-primary justify-self-start opacity-80 mr-4"
            >
              {comment.user?.username}
            </Typography>
            <Typography
              level="captionr"
              className="text-tertiary justify-self-start grow opacity-45"
            >
              {new Date(comment.created_at).toLocaleString()}
            </Typography>

            <MoreIcon />
          </div>
          <Typography level="body2r" className="text-secondary opacity-80">
            {comment.content}
          </Typography>

          {comment.medias && comment.medias.length > 0 && (
            <img
              src={`http://localhost:3000/default/${comment.medias[0]}`}
              alt="comment-image"
              loading="lazy"
              className="max-h-[20rem] md:max-h-[22.5rem] w-full md:rounded-[1.5rem] object-cover"
            />
          )}
        </div>
      </div>

      {/* <LineComment /> */}
      {!isLast && <LineComment />}

      <div className="flex justify-end items-center md:justify-start md:pl-[48px]">
        <ReactItem
          value={comment.interactions?.likes || 0}
          icon={<HeartIcon isActive={isLiked} />}
          onClick={handleLikeClick}
        />

        <ReactItem
          onClick={handleRecommentClick}
          value={comment.interactions?.recomments || 0}
          icon={<RepostIcon isActive={isRecommented} />}
        />

        <ReactItem
          value={comment.interactions?.comments || 0}
          icon={<CommentIcon />}
        />

        <div className="flex items-center md:grow justify-end gap-4">
          <BookmarkIcon height={24} width={24} />
          <ShareIcon height={24} width={24} />
        </div>
      </div>
    </div>
  );
}
