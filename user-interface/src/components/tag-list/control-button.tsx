import { cn } from '@lib/utils';
import React from 'react';
import GoLeft from '@components/icons/go-left';
import GoRight from '@components/icons/go-right';

interface ControlButton {
  className?: string;
  is_left: boolean;
  tagsListRef: React.RefObject<HTMLDivElement>;
}

const TagListControlButton: React.FC<ControlButton> = ({
  className,
  is_left,
  tagsListRef,
}) => {
  const getScrollDistance = () => {
    if (tagsListRef.current) {
      const containerWidth = tagsListRef.current.offsetWidth;
      const scrollDistance = containerWidth - 70;
      return scrollDistance;
    }
    return 300;
  };

  const handleScroll = () => {
    if (tagsListRef.current) {
      console.log('click');

      tagsListRef.current.scrollBy({
        left: is_left ? -getScrollDistance() : getScrollDistance(),
        behavior: 'smooth',
      });
    }
  };

  if (is_left) {
    return (
      <div
        id="go-left"
        onClick={handleScroll}
        className={cn(
          'absolute items-center justify-center left-0 bg-neutral3-50 rounded-full flex w-6 h-6 cursor-pointer',
          className,
        )}
      >
        <GoLeft></GoLeft>
      </div>
    );
  }
  return (
    <div
      id="go-right"
      onClick={handleScroll}
      className={cn(
        'absolute right-0 items-center justify-center bg-neutral3-50 rounded-full flex w-6 h-6 cursor-pointer',
        className,
      )}
    >
      <GoRight></GoRight>
    </div>
  );
};

export default TagListControlButton;
