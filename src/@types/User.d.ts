type User = {
  id: number;
  name: string;
  nickname: string;
  email: string;
  birthday: Date;
  gender: string;
  image?: string;
  profile?: number;
  password: string;
};

export default User;
