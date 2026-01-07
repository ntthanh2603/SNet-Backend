import { UploadIcon } from '@components/icons';
import React, { useRef } from 'react';

//-------------------------------------------------------------------------

function handelSubmitMessage() {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = e.currentTarget.querySelector('input');
    const message = inputElement ? inputElement.value : '';
    console.log(message);
  };
}

export default function ChatInput() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger input file click
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
    }
  };
  return (
    <div className="w-full p-3">
      <form onSubmit={handelSubmitMessage()}>
        <div className="flex items-center gap-4 p-2.5 rounded-[2.625rem] bg-neutral4-30">
          <button
            className="btn-upload p-[0.4375rem] group"
            onClick={handleButtonClick}
          >
            <UploadIcon></UploadIcon>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            className="grow text-primary placeholder:text-light placeholder:text-sm placeholder:font-normal bg-transparent"
          />
          <button type="submit" className="hidden"></button>
        </div>
      </form>
    </div>
  );
}
