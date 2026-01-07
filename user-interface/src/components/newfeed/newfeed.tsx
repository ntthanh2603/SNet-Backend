import { Post } from '@components/post';

//--------------------------------------------------------------------------------------------------------

interface NewfeedProps {
  contentType: 'post' | 'media';
  list: any[];
}

export default function Newfeed({ contentType, list }: NewfeedProps) {
  const hasPost = (
    <div className="grow flex w-full flex-col gap-2 items-center py-2">
      {list.map((post: any) => (
        <Post key={post.id} post={post}></Post>
      ))}
    </div>
  );

  const hasMedia = (
    <div className="grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4">
      {list.map((mediaUrl: any) => (
        <img
          src={mediaUrl}
          alt="media"
          className="w-full md:w-[218.67px] lg:w-[290px] xl:w-[210px] max-h-[12rem] rounded-[1.5rem] object-cover"
        />
      ))}
    </div>
  );
  return contentType === 'post' ? hasPost : hasMedia;
}
