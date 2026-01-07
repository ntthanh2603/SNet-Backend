import React from 'react';

//-------------------------------------------------------------------------
interface InputProps {
  type: string;
  name: string;
  placeholder: string;
  value?: string;
  icon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function Input({
  type,
  name,
  placeholder,
  icon,
  value,
  onChange,
  disabled,
}: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        // autocomplete="current-password"
        required
        className="w-full bg-neutral2-5 placeholder:text-tertiary base text-primary text-sm px-5 py-4 rounded-xl transition border-[1.5px] border-transparent focus:border-neutral2-10"
        onChange={onChange}
        disabled={disabled}
      />
      {icon}
    </div>
  );
}
