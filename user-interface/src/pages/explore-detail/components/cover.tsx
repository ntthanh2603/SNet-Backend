import { IImage } from "@interfaces/image";

export default function Cover({ thumbnailImg }: { thumbnailImg: IImage }) {
  return (
    <section className="w-full">
      <div className="relative">
        <img
          src={thumbnailImg.url}
          className="max-h-[11.25rem] w-full object-cover"
          alt={thumbnailImg.alt}
        />
      </div>
    </section>
  );
}
