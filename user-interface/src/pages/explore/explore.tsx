import ExploreCard from '@components/explore-card/explore-card';
import {
  _exploreCard as fakeExploreCard,
  IExploreCard,
} from '@_mocks/_explore';
import { CircleButton } from '@components/button';
import { ArrowBackIcon } from '@components/icons';
import ToggleGroup from '@components/toggle-group/toggle-group';
import { TagsBar } from '@components/tagbar';
import { SearchBar } from '@components/search';

export default function Explore() {
  const tagNames = ['All', 'Movie', 'Event', 'Food', 'Drink'];

  return (
    <div className="w-full max-h-screen min-h-screen flex flex-col p-3 gap-3 bg-surface">
      <div className="flex items-center gap-3">
        <CircleButton className="p-2.5" children={<ArrowBackIcon />} />
        <ToggleGroup
          items={[
            { key: '1', label: 'For you' },
            { key: '2', label: 'Trending' },
          ]}
          className="hidden md:flex w-[18.25rem]"
        />
        <SearchBar className="flex grow" />
      </div>

      <TagsBar tagNames={tagNames} />

      <div className="w-full max-h-screen pb-[5rem] md:pb-0 overflow-y-auto flex flex-col gap-2 md:grid md:grid-cols-2 no-scrollbar scroll-smooth">
        {fakeExploreCard.map((explore: IExploreCard) => (
          <ExploreCard key={explore.id} explore={explore} />
        ))}
      </div>
    </div>
  );
}
