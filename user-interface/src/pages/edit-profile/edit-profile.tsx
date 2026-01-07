import { Cover, ProfileHeader, UserEditForm } from './components';

export default function EditProfile() {
  return (
    <section className="w-full relative flex flex-col items-center pb-[5rem] bg-surface min-h-svh md:pb-0 lg:mr-[21.25rem] xl:mr-[30rem] transition-all duration-[0.5s]">
      <ProfileHeader />
      <Cover />
      <UserEditForm />
    </section>
  );
}
