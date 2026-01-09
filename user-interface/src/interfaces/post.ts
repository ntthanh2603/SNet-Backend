export interface Comment {
  id: number;
  user?: {
    name: string;
    avatar: string;
  };
  content?: {
    text: string;
    image?: string;
  };
  interactions?: {
    likes: number;
    reposts: number;
    comments: number;
    is_liked?: boolean;
  };
}

export interface Post {
  id: number;
  user?: {
    name: string;
    avatar: string;
    time: string;
  };
  content?: {
    text: string;
    image?: string;
  };
  interactions?: {
    likes: number;
    reposts: number;
    comments: number;
    is_liked?: boolean;
  };
  comments: Comment[];
  cateId?: string;
}
