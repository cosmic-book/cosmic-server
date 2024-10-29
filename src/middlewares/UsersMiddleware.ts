import { User } from '@/@types';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';

export default async function UsersMiddleware(req: Request, res: Response, next: NextFunction) {
  const value = req.body as any;

  if (value) {
    let { name, username, email, birthday, gender, password } = value as User;

    const emailRegex = new RegExp('^[a-z0-9.]+@[a-z0-9]+.[a-z]+(.[a-z]+)?$', 'i');

    if (!name || !email || !birthday || !gender) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    if (username && username.trim().includes(' ')) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Nome de usuário não pode conter espaços'
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'E-mail inválido'
      });
    }

    if (birthday.toString().length !== 10) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Data inválida'
      });
    }

    if (password && password.length < 8) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Sua senha precisa conter no mínimo 8 caracteres'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
