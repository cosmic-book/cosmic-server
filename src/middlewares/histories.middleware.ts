import { THistory } from '@/@types';
import { EditionsService, ReadingsService, UsersService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export async function HistoriesMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: THistory = req.body;

  if (value) {
    let { id_user, id_reading, date, read_pages } = value;

    if (!id_user) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Usuário não informado'
      });
    }

    if (!id_reading) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Leitura não informada'
      });
    }

    const user = await UsersService.getById(id_user);
    const reading = await ReadingsService.getById(id_reading);

    if (!user || !reading || !date || !read_pages) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    if (moment(date).isAfter(new Date())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'A data do registro não pode ser maior que a data atual'
      });
    }

    const edition = await EditionsService.getById(reading.id_edition);

    if (edition && (read_pages < 0 || read_pages > edition.num_pages)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Quantidade de Páginas inválida'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
