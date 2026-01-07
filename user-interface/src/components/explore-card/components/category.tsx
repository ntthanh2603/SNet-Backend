import { Typography } from '@components/typography';

interface CategoryProps {
  color: string;
  categoryName: string;
}

export default function Category({ color, categoryName }: CategoryProps) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="9"
        height="8"
        viewBox="0 0 9 8"
        fill="none"
      >
        <circle cx="4.375" cy="4" r="4" fill={color} />
      </svg>

      <Typography level="smallsm" className="text-primary">
        {categoryName}
      </Typography>
    </>
  );
}
