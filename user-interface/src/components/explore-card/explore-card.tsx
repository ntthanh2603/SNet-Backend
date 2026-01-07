import { AvatarGroup } from '@components/avatar';
import { Typography } from '@components/typography';
import { Category } from './components';
import { IExploreCard } from '@_mocks/_explore';
import { Link } from 'react-router-dom';

interface ExploreCardProps {
  explore: IExploreCard;
}

export default function ExploreCard({ explore }: ExploreCardProps) {
  return (
    <Link to={`/explore/${explore.id}`} className="group w-full min-w-[17.5rem] flex flex-col rounded-[20px] p-3 bg-neutral2-2 gap-3 md:items-start md:justify-center md:hover:bg-[#f8f8f81a]">
      <img
        src={explore.thumbnailImg.url}
        alt={explore.thumbnailImg.alt}
        height={explore.thumbnailImg.height}
        width={explore.thumbnailImg.width}
        className="rounded-xl gap-2 justify-start items-center max-h-[212px] w-full object-cover"
      />
      <div className="trending-content grow flex flex-col gap-2 mx-2 md:justify-start md:items-start opacity-80">
        <Typography level="base2m" className="text-primary line-clamp-1">
          {explore.title}
        </Typography>
        <Typography level="captionr" className="text-secondary line-clamp-2">
          {explore.description}
        </Typography>
      </div>

      <div className="flex w-full justify-start items-center gap-3 px-3">
        <AvatarGroup
          avatars={explore.avatars}
          className="size-[1.25rem] min-w-[1.25rem] border-neutral2-2"
        />

        <Typography level="small" className="text-secondary opacity-50">
          Trending now
        </Typography>

        <Category
          color={explore.colorCategory}
          categoryName={explore.category}
        />
      </div>
    </Link>
  );
}
