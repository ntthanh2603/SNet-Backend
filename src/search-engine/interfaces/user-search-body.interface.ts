import { GenderType } from 'src/helper/helper.enum';

export interface UserSearchBody {
  id: string;
  username: string;
  email: string;
  bio: string;
  website: string;
  avatar: string;
  address: string;
  gender: GenderType;
}
