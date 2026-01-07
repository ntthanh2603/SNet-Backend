import { LeftButton, RightButton } from '@components/button';
import { cn } from '@lib/utils';
import React, { useState } from 'react';

interface TagsBarProps {
  tagNames: string[];
  className?: string;
}

const TagsBar: React.FC<TagsBarProps> = ({ tagNames, className }) => {
  const [activeTag, setActiveTag] = useState<string>('All');

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
  };

  return (
    <div
      className={cn(
        'relative flex space-x-2 items-center p-6 justify-center gap-3 w-full overflow-y-scroll no-scrollbar',
        className,
      )}
    >
      {/* Left Button */}
      <div className="absolute items-center justify-center left-0 bg-neutral3-50 rounded-full flex w-6 h-6 cursor-pointer">
        <LeftButton />
      </div>

      {/* Tags List */}
      <div className="absolute flex justify-start items-start gap-1 flex-nowrap overflow-x-auto scrollbar-hide w-full max-w-[calc(100%-70px)]">
        {tagNames.map((tag) => (
          <span
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`tag-card text-[#f8f8f8b3] text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#f8f8f81a] ${
              activeTag === tag ? 'active' : ''
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Right Button */}
      <div className="absolute right-0 bg-neutral3-50 rounded-full flex justify-center items-center w-6 h-6 cursor-pointer">
        <RightButton />
      </div>
    </div>
  );
};

export default TagsBar;
