import React, { useState } from 'react';
import ToggleItem from './toggle-item';
import { cn } from '@lib/utils';

interface ToggleItem {
  key: string;
  label: string;
}

interface ToggleGroupProps {
  items: ToggleItem[];
  className?: string;
  onChange?: (key: string) => void;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({
  items,
  className,
  onChange,
}) => {
  const [active, setActive] = useState(items[0].key);

  const handleItemClick = (key: string) => {
    setActive(key);
    if (onChange) {
      onChange(key);
    }
  };

  return (
    <div
      id="toggle-group"
      className={cn(
        'w-full p-1 flex justify-between items-center bg-neutral3-60 rounded-[100px]',
        className,
      )}
    >
      {items.map((item) => (
        <ToggleItem
          key={item.key}
          label={item.label}
          isActive={active === item.key}
          onClick={() => handleItemClick(item.key)}
        />
      ))}
    </div>
  );
};

export default ToggleGroup;
