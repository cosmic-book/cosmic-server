import { NextFunction, Request, Response } from 'express';
import { Gender } from '@/@types';
import { HttpStatus } from '@/enums/HttpStatus';

export default async function GendersMiddleware(req: Request, res: Response, next: NextFunction) {
  const value = req.body as any;

  if (value) {
    let { name } = value as Gender;

    if (!name) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Informações inválidas' });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
