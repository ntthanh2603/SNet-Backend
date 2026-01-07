import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLInputElement> &{};
function Toggle({...props}: Props) {
  return (
    <label className="switch inline-flex items-center cursor-pointer">
      <input {...props} type="checkbox" value="" className="sr-only peer" />
      <div className="relative w-11 h-6 p-1 bg-neutral2-5 rounded-full peer peer-checked:after:translate-x-[20px] rtl:peer-checked:after:-translate-x-[20px]  after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-neutral2-30 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral3-50 peer-checked:after:bg-linear-object"></div>
    </label>
  );
}

export default Toggle;
