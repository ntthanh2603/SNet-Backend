import { Avatar } from '@components/avatar';
import {
  Button,
  EmojiButton,
  GifButton,
  ImageButton,
  TagButton,
} from '@components/button';
import { Typography } from '@components/typography';
import { useState } from 'react';

//-------------------------------------------------------------------------
import { useCommentsControllerCreate } from '@services/apis/gen/queries';
import { useQueryClient } from '@tanstack/react-query';

interface PostContentProps {
  usedBy: 'post' | 'reply';
  postId?: string;
}

export default function ComposerInput({ usedBy, postId }: PostContentProps) {
  const [isInputFocused, setInputFocused] = useState(false);
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { mutate: createComment, isPending } = useCommentsControllerCreate({
    mutation: {
      onSuccess: () => {
        setContent('');
        setInputFocused(false);
        if (postId) {
          queryClient.invalidateQueries({
            queryKey: [`/posts/${postId}`] as const,
          });
        }
      },
    },
  });

  const handleSubmit = () => {
    if (usedBy === 'reply' && postId && content.trim()) {
      createComment({
        data: {
          content,
          post_id: postId,
        },
      });
    }
  };

  return (
    <div
      className={`w-full flex ${isInputFocused ? 'flex-col bg-neutral3-70' : 'flex-row bg-neutral2-2'} gap-3 items-center justify-between p-3 bottom-0  rounded-[1.25rem]`}
    >
      <div
        id="reply-content"
        className="w-full flex justify-between items-center gap-3 grow"
      >
        <Avatar
          avtClassName="rounded-full size-[44px]"
          src="https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg"
        />

        <input
          type="text"
          placeholder={
            usedBy === 'post' ? 'Start a post...' : 'Post your reply...'
          }
          id="input-reply"
          className="!bg-transparent text-tertiary placeholder:text-tertiary grow opacity-50 focus:outline-none focus:bg-transparent focus:opacity-100"
          onFocus={() => setInputFocused(true)}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div
        id="post-action"
        className={`${isInputFocused ? 'w-full' : 'w-fit'}  flex items-center justify-between`}
      >
        {/* Chỉ hiển thị tool-reply khi input được focus */}
        {isInputFocused && (
          <div id="tool-reply" className="flex gap-1 items-center">
            <EmojiButton />
            <ImageButton />
            <GifButton />
            <TagButton />
          </div>
        )}

        <Button
          disabled={!isInputFocused || isPending || !content.trim()}
          className={`px-[1.5rem] py-[0.75rem]`}
          type="submit"
          onClick={handleSubmit}
          child={
            <Typography className="text-secondary" level="base2sm">
              {isPending ? 'Posting...' : usedBy === 'post' ? 'Post' : 'Reply'}
            </Typography>
          }
        />
      </div>
    </div>
  );
}
