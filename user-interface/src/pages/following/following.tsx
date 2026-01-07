import { CircleButton } from '@components/button';
import { ArrowBackIcon } from '@components/icons';
import ProfileCard from '@components/profile-card/profile-card';
import ToggleGroup from '@components/toggle-group/toggle-group';
import { Typography } from '@components/typography';
import { useNavigate } from 'react-router-dom';
import { _follow as fakeFollow } from '@_mocks/_follow';
import React from 'react';

//--------------------------------------------------------------------------

export default function Following() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = React.useState<'follower' | 'following'>(
    'follower',
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggle = (key: string) => {
    if (key === '1') {
      setActiveType('follower');
    } else if (key === '2') {
      setActiveType('following');
    }
  };

  const filteredList = fakeFollow.filter(
    (follow) => follow.types === activeType,
  );

  return (
    <section className="w-full min-h-screen md:h-full bg-surface p-3 pb-[5rem] md:pb-0 transition-all duration-[0.5s]">
      <section className="mt-[3rem] md:mt-0 mb-3 flex gap-5 items-center">
        <CircleButton
          children={<ArrowBackIcon />}
          disabled={false}
          onClick={() => handleBack()}
          className="cursor-pointer md:bg-button rounded-full p-[0.625rem]"
        />
        <Typography level="title" className="text-tertiary">
          200Lab
        </Typography>
      </section>
      <ToggleGroup
        className="w-full h-12 my-3"
        items={[
          { key: '1', label: 'Follower' },
          { key: '2', label: 'Following' },
        ]}
        onChange={(key) => handleToggle(key)}
      />
      <div className="flex flex-col gap-2 mt-3">
        {filteredList.map((follow) => (
          <ProfileCard
            key={follow.id}
            userName={follow.name}
            userHandle={follow.username}
            types={follow.types as 'follower' | 'following'}
            src={''}
          />
        ))}
      </div>
    </section>
  );
}
