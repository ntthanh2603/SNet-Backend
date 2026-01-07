export default function Switch() {
  return (
    <>
      <label className="relative inline-block w-11 h-6">
        <input type="checkbox" className="opacity-0 w-0 h-0 peer" />
        <span className="absolute cursor-pointer inset-0 bg-neutral2-5 transition duration-400 rounded-full peer-checked:bg-neutral2-30"></span>
        <span className="absolute h-4 w-4 left-1 bottom-1 bg-neutral2-30 transition duration-400 rounded-full peer-checked:translate-x-5"></span>
      </label>
    </>
  );
}
