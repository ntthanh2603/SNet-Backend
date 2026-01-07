import { _exploreCard as fakeExplores, IExploreCard } from '@_mocks/_explore';
import { _posts as fakePosts } from '@_mocks/_posts';
import { Newfeed } from '@components/newfeed';
import ToggleGroup from '@components/toggle-group/toggle-group';
import { useParams } from 'react-router-dom';
import { Cover, ExploreHeader, ExploreInfo } from './components';

//--------------------------------------------------------------------------------------------------------------------------------

export default function ExploreDetail() {
  const { id } = useParams();

  const explore = fakeExplores.find((explore: IExploreCard) => explore.id === id);
  return (
    <section className="w-full relative flex flex-col items-center bg-surface min-h-svh pb-[5rem] md:pb-0 lg:mr-[21.25rem] xl:mr-[30rem] transition-all duration-[0.5s]">
      <ExploreHeader />
      <Cover thumbnailImg={explore!.thumbnailImg}/>
      <ExploreInfo explore={explore!}/>
      <section className="w-full p-3 flex flex-col gap-3">
        <ToggleGroup
          items={[
            { key: '1', label: 'Trending' },
            { key: '2', label: 'Lastest' },
            { key: '3', label: 'People' },
          ]}
        />

        <Newfeed contentType="post" list={fakePosts} />
      </section>
    </section>
  );
}
