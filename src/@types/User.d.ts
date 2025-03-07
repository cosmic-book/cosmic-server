import { UserGender } from '@/enums';

export type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  birthday: Date;
  gender: UserGender;
  image?: string;
  profile?: number;
  password: string;
  is_deleted?: boolean;
};
