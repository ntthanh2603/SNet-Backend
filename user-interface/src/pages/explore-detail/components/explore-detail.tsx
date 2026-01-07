import { IExploreCard } from '@_mocks/_explore';
import { CircleButton } from '@components/button';
import {
  BookmarkIcon,
  CommentIcon,
  ProfileIcon,
  ShareIcon
} from '@components/icons';
import { Typography } from '@components/typography';
import { useNavigate } from 'react-router-dom';

//-------------------------------------------------------------------------

export default function ExploreDetail({ explore }: { explore: IExploreCard}) {
  const navigate = useNavigate();

  return (
    <section className="w-full flex flex-col gap-[1.25rem] p-6 mt-6 ">
      <div
        id="profile-info-header"
        className="flex flex-col md:flex-row items-start gap-[0.4375rem]"
      >
        <div className="grow opacity-80 w-full">
          <Typography level="title" className="text-primary">
            {/* James Webb Telescope Unveils Ancient Galaxy Cluster */}
            {explore.title}
          </Typography>
          <Typography level="base2r" className="text-tertiary">
            {explore.trendingTime}
          </Typography>
        </div>

        <div className="flex w-full items-center justify-around md:grow md:justify-end gap-4">
          <CircleButton
            children={<BookmarkIcon height={24} width={24} />}
            className="hidden md:block p-2.5"
          />
          <CircleButton
            children={
              <Typography level="base2sm" className="text-secondary">
                Bookmark
              </Typography>
            }
            className="md:hidden w-full py-2"
          />
          <CircleButton
            children={<ShareIcon height={24} width={24} />}
            className="hidden md:block p-2.5"
          />
          <CircleButton
            children={
              <Typography level="base2sm" className="text-secondary">
                Share
              </Typography>
            }
            className="md:hidden w-full py-2"
          />

        </div>
      </div>
      <Typography level="body2r" className="text-tertiary opacity-80">
        {/* The James Webb Space Telescope has made a groundbreaking discovery,
        revealing the oldest and most distant galaxy cluster ever observed.
        This finding is reshaping our understanding of early universe formation and cosmic evolution.
        Scientists are excited about the implications for dark matter theories and the potential for
        identifying primordial black holes. */}
        {explore.description}
      </Typography>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-sm base opacity-80 cursor-pointer rounded-button px-3 py-2 hover:bg-neutral2-5">
            <CommentIcon />

            <Typography
              level="base2r"
              className="text-primary flex items-center gap-2"
            >
              2k
              <Typography level="base2r" className="text-tertiary">
                posts
              </Typography>
            </Typography>
          </div>

          <div
            onClick={() => navigate('/following')}
            className="flex items-center gap-2 text-sm base opacity-80 cursor-pointer rounded-button px-3 py-2 hover:bg-neutral2-5"
          >
            <ProfileIcon />
            <Typography
              level="base2r"
              className="text-primary flex items-center gap-2"
            >
              1k
              <Typography level="base2r" className="text-tertiary">
                people
              </Typography>
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}
