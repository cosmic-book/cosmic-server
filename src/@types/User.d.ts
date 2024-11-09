import { Gender } from '@/enums';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  birthday: Date;
  gender: Gender;
  image?: string;
  profile?: number;
  password: string;
};

export default User;
