import { CameraIcon } from '@components/icons';

export default function Cover() {
  return (
    <section className="w-full">
      <div className="relative">
        <img
          src="https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg"
          className="max-h-[11.25rem] w-full object-cover"
          alt="Banner"
        />
        <div className="relative">
          <div className="absolute w-20 h-20 left-6 -bottom-[2.5rem] border-[0.25rem] border-[#2B2B2B] rounded-full z-[15] bg-neutral4-60 flex flex-col justify-center items-center ">
            <CameraIcon></CameraIcon>
          </div>
          <img
            src="https://i.pinimg.com/originals/a4/72/10/a47210899e2f804d4f4aead44adaefe0.jpg"
            alt="avatar"
            className="border-[0.25rem] border-[#2B2B2B] absolute size-[5rem] min-w-[5rem] rounded-full z-10 left-6 -bottom-[2.5rem]"
          />

          <input
            type="file"
            id="upload-avatar"
            className="absolute left-6 -bottom-[2.5rem] opacity-0 w-20 h-20 rounded-full focus:opacity-0 z-20"
          />
        </div>
      </div>
    </section>
  );
}
