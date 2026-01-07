interface ITrendingData {
  id: string;
  trendingName: string;
  time: string;
  thumbnail: string;
  isNew?: boolean;
}

export const _trendingData: ITrendingData[] = [
  {
    id: '1',
    trendingName: 'Apple Releases iOS 17.6.1 with Advanced Data Protection Fix',
    time: '4',
    thumbnail:
      'https://i.pinimg.com/736x/06/45/8f/06458f01de1d39767665e3e9ed7241e6.jpg',
    isNew: true,
  },
  {
    id: '2',
    trendingName: 'Apple Releases iOS 17.6.2 with Advanced Data Protection Fix',
    time: '5',
    thumbnail:
      'https://i.pinimg.com/564x/f1/14/c2/f114c2287b81b2f51f790eb9c90171e7.jpg',
  },
];
