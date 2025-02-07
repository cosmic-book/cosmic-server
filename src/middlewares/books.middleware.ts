import { TBook } from '@/@types';
import { AuthorsService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export async function BooksMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: TBook = req.body;

  if (value) {
    let { title, release_date, language } = value;

    if (!title || !release_date || !language) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    const releaseDate = moment(release_date);

    if (releaseDate.isAfter(new Date())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'A data de lançamento não pode ser maior que a data atual'
      });
    }

    if (language.length !== 3) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Idioma inválido'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
