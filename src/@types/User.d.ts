import { Gender } from '@/enums';

export type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  birthday: Date;
  gender: Gender;
  image?: string;
  profile?: number;
  password: string;
  is_deleted?: boolean;
};
