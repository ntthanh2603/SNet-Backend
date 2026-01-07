export const getSummaryNames = (names: string[]): string => {
  const nameCount = names.length;

  if (nameCount === 0) return '';
  if (nameCount === 1) return names[0];
  if (nameCount === 2) return `${names[0]} and ${names[1]}`;
  if (nameCount === 3) return `${names[0]}, ${names[1]} and ${names[2]}`;

  // If there are more than 3 names
  return `${names[0]}, ${names[1]}, ${names[2]} and ${nameCount - 3} others`;
};
