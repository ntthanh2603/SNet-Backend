import { cn } from '@lib/utils';
import React from 'react';

interface TagCard {
  tagName: string;
  className?: string;
  onClick?: () => void;
}

const TagCard: React.FC<TagCard> = ({ tagName, className, onClick }) => {
  return (
    <span
      className={cn(
        'tag-card text-neutral2-70 text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-neutral2-10',
        className,
      )}
      onClick={onClick}
    >
      {tagName}
    </span>
  );
};

export default TagCard;
