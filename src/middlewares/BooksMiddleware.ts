import { NextFunction, Request, Response } from 'express';
import { Book } from '@/@types';
import { HttpStatus } from '@/enums/HttpStatus';

export default async function BooksMiddleware(req: Request, res: Response, next: NextFunction) {
  const value = req.body as any;

  if (value) {
    let { title, pages, isbn_13, isbn_10, description, language, publisher } = value as Book;

    if (!title || !pages || !description || !language || !publisher) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Informações inválidas' });
    }

    if (isbn_13 && isbn_13.length !== 13) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Valor de ISBN 13 inválido' });
    }

    if (isbn_10 && isbn_10.length !== 10) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Valor de ISBN 10 inválido' });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
