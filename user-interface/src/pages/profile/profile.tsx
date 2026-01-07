import { Cover, ProfileHeader, UserInfo } from './components';
import ToggleGroup from '@components/toggle-group/toggle-group';
import { Newfeed } from '@components/newfeed';
import { useParams } from 'react-router-dom';
import {
  usePostsControllerFindAllInfinite,
  useUsersControllerGetProfile,
} from '@services/apis/gen/queries';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function Profile() {
  const { id } = useParams();
  const { ref, inView } = useInView();

  const { data: profileData, isLoading: isProfileLoading } =
    useUsersControllerGetProfile(id as string, {
      query: {
        enabled: !!id,
      },
    });

  const user = (profileData as any)?.data;

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsControllerFindAllInfinite(
    {
      limit: 10,
      user_id: id,
    },
    {
      query: {
        enabled: !!id,
        getNextPageParam: (lastPage: any) => {
          const { meta } = lastPage.data;
          if (meta.currentPage < meta.totalPages) {
            return meta.currentPage + 1;
          }
          return undefined;
        },
      },
    },
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = postsData?.pages.flatMap((page: any) => page.data?.data) || [];

  if (isProfileLoading) return <div>Loading profile...</div>;

  return (
    <section className="w-full relative flex flex-col items-center bg-surface min-h-svh pb-[5rem] md:pb-0 lg:mr-[21.25rem] xl:mr-[30rem] transition-all duration-[0.5s]">
      <ProfileHeader />
      <Cover />
      {user ? <UserInfo user={user} /> : <div>User not found</div>}
      <section className="w-full p-3 flex flex-col gap-3">
        <ToggleGroup
          items={[
            { key: '1', label: 'Posts' },
            { key: '2', label: 'Featured' },
            { key: '3', label: 'Media' },
          ]}
        />

        <Newfeed contentType="post" list={posts} />
        <div ref={ref} className="h-10 w-full flex justify-center items-center">
          {isFetchingNextPage && <div>Loading more...</div>}
        </div>
      </section>
    </section>
  );
}
