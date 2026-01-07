import { IImage } from '@interfaces/image';
import { AvatarData } from './_avatar';

export interface IExploreCard {
  id: string;
  avatars: AvatarData[];
  thumbnailImg: IImage;
  title: string;
  description: string;
  category: string;
  colorCategory: string;
  trendingTime?: string;
}

export const _exploreCard: IExploreCard[] = [
  {
    id: '1',
    avatars: [
      {
        id: '1',
        src: 'https://i.pinimg.com/564x/f1/14/c2/f114c2287b81b2f51f790eb9c90171e7.jpg',
        alt: 'Avatar 1',
      },

      {
        id: '2',
        src: 'https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg',
        alt: 'Avatar 2',
      },
    ],
    thumbnailImg: {
      url: 'https://i.pinimg.com/564x/f1/14/c2/f114c2287b81b2f51f790eb9c90171e7.jpg',
      alt: 'Thumbnail 1',
    },
    title: 'Discover Hidden Gems',
    description:
      'Explore the unseen corners of the world with exclusive guides.',
    category: 'Travel',
    colorCategory: '#3498db', // Blue color code
    trendingTime: 'Trending 2h ago',
  },
  {
    id: '2',
    avatars: [
      {
        id: '3',
        src: 'https://i.pinimg.com/564x/9b/a0/65/9ba06536d17a2eb4d210f0e4e0a8209f.jpg',
        alt: 'Avatar 3',
      },
      {
        id: '4',
        src: 'https://i.pinimg.com/736x/95/6e/14/956e144e89b472c3f1f52ffd5cb52cab.jpg',
        alt: 'Avatar 4',
      },
    ],
    thumbnailImg: {
      url: 'https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg',
      alt: 'Thumbnail 1',
    },
    title: 'Mastering Photography',
    description: 'Learn photography tips and tricks from the experts.',
    category: 'Photography',
    colorCategory: '#e74c3c', // Red color code
    trendingTime: 'Trending 2h ago',
  },
  {
    id: '3',
    avatars: [
      {
        id: '3',
        src: 'https://i.pinimg.com/564x/9b/a0/65/9ba06536d17a2eb4d210f0e4e0a8209f.jpg',
        alt: 'Avatar 3',
      },
      {
        id: '4',
        src: 'https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg',
        alt: 'Avatar 4',
      },
    ],
    thumbnailImg: {
      url: 'https://i.pinimg.com/564x/94/68/55/9468556ed175e0899b77c2d2741d3340.jpg',
      alt: 'Thumbnail 1',
    },
    title: 'Healthy Eating Made Easy',
    description: 'Find simple and delicious recipes for a healthy lifestyle.',
    category: 'Food',
    colorCategory: '#f39c12', // Orange color code
    trendingTime: 'Trending 2h ago',
  },
  {
    id: '4',
    avatars: [
      {
        id: '5',
        src: 'https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg',
        alt: 'Avatar 5',
      },
      {
        id: '6',
        src: 'https://i.pinimg.com/736x/83/7b/97/837b97c547bd502ba76a7964af13a1c3.jpg',
        alt: 'Avatar 6',
      },
    ],
    thumbnailImg: {
      url: 'https://i.pinimg.com/564x/ec/86/c8/ec86c89613a5deef770bf2c41614b062.jpg',
      alt: 'Thumbnail 1',
    },
    title: 'Sustainable Living Tips',
    description: 'Practical advice for living a more eco-friendly lifestyle.',
    category: 'Environment',
    colorCategory: '#1abc9c',
    trendingTime: 'Trending 2h ago',
  },
];
