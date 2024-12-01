import { THistory } from '@/@types';
import { BooksService, ReadingsService } from '@/database/services';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export async function HistoriesMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: THistory = req.body;

  if (value) {
    let { id_reading, date, read_pages } = value;

    if (!id_reading) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Leitura não informada'
      });
    }

    const reading = await ReadingsService.getById(id_reading);

    if (!reading || !date || !read_pages) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    if (date && moment(date).isAfter(new Date())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'A data não pode ser maior que a data atual'
      });
    }

    const book = await BooksService.getById(reading.id_book);

    if (book && (read_pages < 0 || read_pages > book.pages)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Quantidade de Páginas inválida'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}