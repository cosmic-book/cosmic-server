import { TBook } from '@/@types';
import { BooksService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export async function BooksMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: TBook = req.body;

  if (value) {
    let { title, first_publish_year, ol_book_key } = value;

    if (!title || !first_publish_year) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    if (ol_book_key) {
      const book = await BooksService.getByOLKey(ol_book_key);

      if (book) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Livro já cadastrado'
        });
      }
    }

    const firstPublishYear = moment(first_publish_year, 'YYYY');
    const actualYear = moment().year();

    if (firstPublishYear.isAfter(actualYear)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'A data de publicação não pode ser maior que a data atual'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
