import { NextFunction, Request, Response } from 'express';
import { Book } from '@/@types';
import { HttpStatus } from '@/enums/HttpStatus';

export default async function UsersMiddleware(req: Request, res: Response, next: NextFunction) {
  const value = req.body as any;

  if (value) {
    let { title, pages, description, language, publisher } = value as Book;

    if (!title || !pages || !description || !language || !publisher) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Informações inválidas' });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
