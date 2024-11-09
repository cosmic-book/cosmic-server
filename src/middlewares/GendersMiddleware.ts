import { TGender } from '@/@types';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';

export async function GendersMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: TGender = req.body;

  if (value) {
    let { name } = value;

    if (!name) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
