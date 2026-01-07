export interface IUser {
  id: string;
  name: string;
  username: string;
  bio: string;
  posts: number;
  followers: number;
  following: number;
  portfolio: string;
}

export const _user: IUser[] = [
  {
    id: '1',
    name: 'Moyo Shiro',
    username: '@moyoshiro',
    bio: '🎨 UI/UX Designer | 💡 Crafting seamless digital experiences\n🚀 Designing user-centric interfaces\n📍 NYC | Post on #Design #UX #UI',
    posts: 8,
    followers: 100,
    following: 80,
    portfolio: 'https://200lab.io/',
  },
  {
    id: '2',
    name: 'Moyo Shiro',
    username: '@moyoshiro',
    bio: '🎨 UI/UX Designer | 💡 Crafting seamless digital experiences\n🚀 Designing user-centric interfaces\n📍 NYC | Post on #Design #UX #UI',
    posts: 8,
    followers: 50,
    following: 60,
    portfolio: 'https://200lab.io/',
  },
  {
    id: '3',
    name: 'Moyo Shiro',
    username: '@moyoshiro',
    bio: '🎨 UI/UX Designer | 💡 Crafting seamless digital experiences\n🚀 Designing user-centric interfaces\n📍 NYC | Post on #Design #UX #UI',
    posts: 6,
    followers: 50,
    following: 20,
    portfolio: 'https://200lab.io/',
  },
];
