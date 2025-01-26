import { TAuthor } from '@/@types';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export async function AuthorsMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: TAuthor = req.body;

  if (value) {
    let { name, birth_date, death_date } = value;

    if (!name || !birth_date) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    if (moment(birth_date).isAfter(new Date())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'A data de nascimento não pode ser maior que a data atual'
      });
    }

    if (death_date) {
      if (moment(death_date).isAfter(new Date())) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'A data de falecimento não pode ser maior que a data atual'
        });
      }

      if (moment(death_date).isSameOrBefore(birth_date)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'A data de falecimento não pode ser menor ou igual a data de nascimento'
        });
      }
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
