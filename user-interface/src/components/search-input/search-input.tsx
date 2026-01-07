import React from 'react';

type SearchInputProps = {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchInput = ({ placeholder, onChange }: SearchInputProps) => {
  return (
    <span className="p-2.5 flex-1 max-w-[338px] rounded-full backdrop-blur-16 bg-neutral3-70 flex gap-3">
      <input
        type="search"
        onChange={onChange}
        placeholder={placeholder}
        className="text-base2 text-tertiary hover:text-primary font-rubik bg-transparent flex-1"
      ></input>
    </span>
  );
};

export default SearchInput;
