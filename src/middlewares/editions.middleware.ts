import { TEdition } from '@/@types';
import { AuthorsService, BooksService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export async function EditionsMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: TEdition = req.body;

  if (value) {
    let { title, id_author, id_book, publish_date, num_pages, isbn_13, isbn_10, language } = value;

    if (!title || !id_author || !id_book || !publish_date || !num_pages || !language) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    const book = await BooksService.getById(id_book);
    const author = await AuthorsService.getById(id_author);

    if (!book) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Livro não encontrado'
      });
    }

    if (!author) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Autor não encontrado'
      });
    }

    if (isbn_13 && isbn_13.length !== 13) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Valor de ISBN-13 inválido'
      });
    }

    if (isbn_10 && isbn_10.length !== 10) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Valor de ISBN-10 inválido'
      });
    }

    if (num_pages < 1) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Número de páginas inválido'
      });
    }

    if (language.length !== 3) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Idioma inválido'
      });
    }

    if (moment(publish_date).isAfter(new Date())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'A data de publicação não pode ser maior que a data atual'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
