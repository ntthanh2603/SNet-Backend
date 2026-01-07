import { Typography } from '@components/typography';
import BMPostItem from './post-item';

//--------------------------------------------------------------------------------------------------------

interface ListItemProps {
  contentType: 'post' | 'media';
  list: any[];
}

export default function ListItem({ contentType, list }: ListItemProps) {
  if (list.length === 0) {
    return (
      <section className="h-full w-full grow flex flex-col justify-center items-center">
        <img
          src="/svg/automated_customer_support.svg"
          alt="no-data"
          className="w-fit object-contain mb-[1.75rem]"
        />
        <Typography level="title" className="text-primary opacity-60">
          Select Folder
        </Typography>
        <Typography level="base2r" className="text-secondary opacity-50">
          Please add bookmark to folder
        </Typography>
      </section>
    );
  }

  const hasPost = (
    <div className="grow flex w-full flex-col gap-2 items-center py-3">
      {list.map((post: any) => (
        <BMPostItem key={post.id} post={post} />
      ))}
    </div>
  );

  const hasMedia = (
    <div className="w-full py-3 flex flex-col md:grid md:grid-cols-3 gap-2 2xl:grid-cols-4">
      {list.map((mediaUrl: any) => (
        <img
          key={mediaUrl.id}
          src={mediaUrl?.url}
          alt={mediaUrl?.alt}
          className="w-full md:max-w-[13.6875rem] lg:max-w-[13.1875rem] xl:max-w-[14.1875rem] max-h-[12rem] rounded-[1.5rem] object-cover"
        />
      ))}
    </div>
  );
  return contentType === 'post' ? hasPost : hasMedia;
}
