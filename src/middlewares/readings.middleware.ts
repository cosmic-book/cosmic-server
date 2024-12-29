import { TReading } from '@/@types';
import { BooksService, UsersService } from '@/database/_services';
import { ReadingStatus } from '@/enums';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export async function ReadingsMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: TReading = req.body;

  if (value) {
    let { id_user, id_book, type, status, category, start_date, finish_date } = value;

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

    const user = await UsersService.getById(id_user);
    const book = await BooksService.getById(id_book);

    if (!user || !book || status === null || !(type >= 0 && status >= 0 && category >= 0)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    status = status as ReadingStatus;

    if (status === ReadingStatus.TO_READ && (start_date || finish_date)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Não são aceitas datas para livros não iniciados'
      });
    }

    if (status !== ReadingStatus.TO_READ && status !== ReadingStatus.FINISHED && !start_date) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Data de Início não informada'
      });
    }

    if (status === ReadingStatus.FINISHED && !finish_date) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Data de Conclusão não informada'
      });
    }

    if (start_date && finish_date && moment(finish_date).isBefore(start_date)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Data de Conclusão não pode ser anterior à Data de Início'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
