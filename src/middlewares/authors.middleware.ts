import { TAuthor } from '@/@types';
import { AuthorsService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export async function AuthorsMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: TAuthor = req.body;

  if (value) {
    let { name, birth_date, death_date, ol_author_key } = value;

    if (!name) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    if (ol_author_key) {
      const author = await AuthorsService.getByOLKey(ol_author_key);

      if (author) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Autor já cadastrado'
        });
      }
    }

    const validateDate = (date: string | undefined, message: string) => {
      if (date && moment(date).isAfter(new Date())) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message });
      }
    };

    validateDate(birth_date, 'A data de nascimento não pode ser maior que a data atual');
    validateDate(death_date, 'A data de falecimento não pode ser maior que a data atual');

    if (birth_date && death_date && moment(death_date).isSameOrBefore(birth_date)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'A data de falecimento não pode ser menor ou igual à data de nascimento'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}
