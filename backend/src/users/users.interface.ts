import { GenderType, PrivacyType, StatusType } from 'src/helper/helper.enum';

export interface IUser {
  id: string;
  email: string;
  avatar: string;
  username: string;
  bio: string;
  website: string;
  age: number;
  gender: GenderType;
  address: string;
  privacy: PrivacyType;
  follower_count: number;
  followed_count: number;
  createdAt: Date;
  startus: StatusType;
}
