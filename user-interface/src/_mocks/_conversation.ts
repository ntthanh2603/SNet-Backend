interface IConversation {
  id: number;
  user: {
    avatarUrl: string;
    name: string;
  };
  content: string;
}

export const _conversation: IConversation[] = [
  {
    id: 1,
    user: {
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      name: 'John Doe',
    },
    content: 'Test content',
  },
  {
    id: 2,
    user: {
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      name: 'John Doe 2',
    },
    content: 'Test content 2',
  },
];
