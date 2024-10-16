import { Reading } from '@/@types';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';

export default async function ReadingsMiddleware(req: Request, res: Response, next: NextFunction) {
  const value = req.body as any;

  if (value) {
    let { id_user, id_book } = value as Reading;

    if (!id_user) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Usuário não informado'
      });
    }

    if (!id_book) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Livro não informado'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
