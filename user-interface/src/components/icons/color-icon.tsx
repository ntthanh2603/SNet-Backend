interface ColorIcon {
  color: string;
}

const ColorIcon: React.FC<ColorIcon> = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="8"
      viewBox="0 0 9 8"
      fill="none"
    >
      <circle cx="4.375" cy="4" r="4" fill={color} />
    </svg>
  );
};

export default ColorIcon;
