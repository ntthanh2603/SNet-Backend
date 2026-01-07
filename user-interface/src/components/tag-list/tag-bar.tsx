import { cn } from '@lib/utils';
import React, { useRef } from 'react';
import TagListControlButton from './control-button';
import TagList from './tag-list';

interface TagBar {
  nameList: string[];
  idList: string[];
  barClassName?: string;
  listClassName?: string;
  cardClassName?: string;
  buttonClassName?: string;
}

const TagBar: React.FC<TagBar> = ({
  nameList,
  idList,
  barClassName,
  listClassName,
  cardClassName,
  buttonClassName,
}) => {
  const tagsListRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      id="tags-bar"
      className={cn(
        'relative flex space-x-2 items-center p-5 justify-center gap-3 pb-3 w-full',
        barClassName,
      )}
    >
      <TagListControlButton
        is_left={true}
        tagsListRef={tagsListRef}
        className={buttonClassName}
      ></TagListControlButton>
      <TagList
        nameList={nameList}
        idList={idList}
        listClassName={listClassName}
        cardClassName={cardClassName}
        ref={tagsListRef}
      ></TagList>
      <TagListControlButton
        is_left={false}
        tagsListRef={tagsListRef}
        className={buttonClassName}
      ></TagListControlButton>
    </div>
  );
};

export default TagBar;
