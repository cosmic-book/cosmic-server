import { NextFunction, Request, Response } from 'express';
import { User } from '@/@types';
import { HttpStatus } from '@/enums/HttpStatus';

export default async function UsersMiddleware(req: Request, res: Response, next: NextFunction) {
  const value = req.body as any;

  if (value) {
    let { name, username, email, birthday, gender, password } = value as User;

    const emailRegex = new RegExp('^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$', 'i');

    if (!name || !username || !email || !birthday || !gender || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Informações inválidas' });
    }

    if (username.trim().includes(" ")) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Nome de usuário não pode conter espaços' })
    }

    if (!emailRegex.test(email)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'E-mail inválido' })
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
