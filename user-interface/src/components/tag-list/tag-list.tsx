import { cn } from '@lib/utils';
import { forwardRef, useState } from 'react';
import TagCard from './tag-card';

interface TagList {
  nameList: string[];
  idList: string[];
  listClassName?: string;
  cardClassName?: string;
}

const TagList = forwardRef<HTMLDivElement, TagList>(
  ({ nameList, idList, listClassName, cardClassName }, ref) => {
    const [activeTagIndex, setActiveTagIndex] = useState(0);
    const handleTagClick = (index: number) => {
      setActiveTagIndex(index);
    };

    return (
      <div
        id="tags-list"
        ref={ref}
        className={cn(
          'absolute flex justify-start items-start gap-1 flex-nowrap overflow-x-auto scrollbar-hide w-full max-w-[calc(100%-70px)]',
          listClassName,
        )}
      >
        {nameList.map((tagName, i) => (
          <TagCard
            key={idList[i]}
            tagName={tagName}
            className={cn(cardClassName, {
              'bg-neutral1-5': i === activeTagIndex,
            })}
            onClick={() => handleTagClick(i)}
          />
        ))}
      </div>
    );
  },
);

export default TagList;
