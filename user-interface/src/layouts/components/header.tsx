import { CircleButton } from '@components/button';
import { AddIcon } from '@components/icons';
import { SearchBar } from '@components/search';
import ToggleGroup from '@components/toggle-group/toggle-group';

//-------------------------------------------------------------------------

export default function Header() {
  return (
    <section className="flex items-center gap-2 mb-3">
      <ToggleGroup
        className="w-[20.625rem] h-[2.75rem]"
        items={[
          { key: '1', label: 'For you' },
          { key: '2', label: 'Following' },
        ]}
      />
      <SearchBar className="hidden md:flex grow" />

      <CircleButton
        className="cursor-pointer"
        children={<AddIcon />}
        disabled={false}
      />
    </section>
  );
}
