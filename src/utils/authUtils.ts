import { TUser } from '@/@types';
import jwt from 'jsonwebtoken';

interface IToken {
  token: string;
  exp: Date;
}

export function checkToken(token: string): boolean {
  try {
    const secret = process.env.SECRET_KEY;

    if (!secret) return false;

    return !!jwt.verify(token, secret);
  } catch (err) {
    return false;
  }
}

export function generateToken(user: TUser): IToken {
  try {
    const secret = process.env.SECRET_KEY;

    let result: IToken = {
      token: '',
      exp: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
    };

    if (secret) {
      result.token = jwt.sign(
        {
          id: user.id,
          exp: result.exp.getTime()
        },
        secret
      );
    }

    return result;
  } catch (err: any) {
    throw (err as Error).message;
  }
}
