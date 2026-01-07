import { SearchIcon } from '@components/icons';
import { cn } from '@lib/utils';

//-------------------------------------------------------------------------

interface SearchProps {
  placeholder?: string;
  className?: string;
}

export default function Search({ className, placeholder }: SearchProps) {
  return (
    <div
      className={cn(
        'grow items-center gap-3 rounded-[2.625rem] p-2.5 bg-neutral3-70',
        className,
      )}
    >
      <SearchIcon />
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        className="focus:placeholder:text-primary focus:outline-none focus:placeholder:opacity-100 grow bg-transparent text-primary placeholder:text-tertiary text-sm font-inter font-normal"
      />
    </div>
  );
}
