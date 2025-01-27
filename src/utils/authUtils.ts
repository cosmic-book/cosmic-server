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
    const expTime = Math.floor(Date.now() / 1000) + 60 * 60;

    let token = '';

    if (secret) {
      token = jwt.sign({ id: user.id, exp: expTime }, secret);
    }

    return {
      token,
      exp: new Date(expTime * 1000)
    };
  } catch (err: any) {
    throw (err as Error).message;
  }
}
