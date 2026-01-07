import { CircleButton } from '@components/button';
import {
  CommentIcon,
  EditIcon,
  LinkIcon,
  ProfileIcon,
  ShareIcon,
} from '@components/icons';
import { Typography } from '@components/typography';
import { useNavigate } from 'react-router-dom';
import { User } from '@services/apis/gen/queries';

//-------------------------------------------------------------------------

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  const navigate = useNavigate();

  return (
    <section className="w-full flex flex-col gap-[1.25rem] p-6 mt-6 ">
      <div
        id="profile-info-header"
        className="flex items-center gap-[0.4375rem]"
      >
        <div className="grow opacity-80">
          <Typography level="title" className="text-primary">
            {user.username}
          </Typography>
          <Typography level="base2r" className="text-tertiary">
            @{user.username}
          </Typography>
        </div>

        <CircleButton
          children={<ShareIcon width={24} height={24} />}
          className="p-2.5"
        />

        <CircleButton children={<EditIcon />} className="p-2.5 md:hidden" />
        <CircleButton
          children={
            <Typography level="base2sm" className="text-secondary">
              Edit profile
            </Typography>
          }
          className="hidden md:block px-5 py-2"
          onClick={() => navigate(`/users/${user.id}/edit`)}
        />
      </div>
      <Typography level="body2r" className="text-tertiary opacity-80">
        {user.bio}
      </Typography>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-sm base opacity-80 cursor-pointer rounded-button px-3 py-2 hover:bg-neutral2-5">
            <CommentIcon />

            <Typography
              level="base2r"
              className="text-primary flex items-center gap-2"
            >
              {user.posts?.length || 0}
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
              {user.received_relations?.length || 0}
              <Typography level="base2r" className="text-tertiary">
                followers
              </Typography>
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm base opacity-80 cursor-pointer rounded-button px-3 py-2 hover:bg-neutral2-5">
          <LinkIcon />
          <a href={user.website}>
            <Typography
              level="base2r"
              className="text-primary flex items-center gap-2"
            >
              {user.website}
            </Typography>
          </a>
        </div>
      </div>
    </section>
  );
}
