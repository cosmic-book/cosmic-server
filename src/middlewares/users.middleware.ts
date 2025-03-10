import { TUser } from '@/@types';
import { HttpStatus } from '@/enums/HttpStatus';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export async function UsersMiddleware(req: Request, res: Response, next: NextFunction) {
  const value: TUser = req.body;

  if (value) {
    let { name, username, email, birthday, gender, password } = value;

    const emailRegex = new RegExp('^[a-z0-9.]+@[a-z0-9]+.[a-z]+(.[a-z]+)?$', 'i');

    if (!name || !email || !birthday || gender < 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Informações inválidas'
      });
    }

    if (username && username.trim().includes(' ')) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Nome de usuário não pode conter espaços'
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'E-mail inválido'
      });
    }

    if (!isDateValid(birthday)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Data inválida'
      });
    }

    if (password && password.length < 8) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Sua senha precisa conter no mínimo 8 caracteres'
      });
    }

    next();
  } else {
    return res.status(HttpStatus.NOT_FOUND).end();
  }
}

const isDateValid = (date: Date): boolean => {
  const today = moment().startOf('day');
  const maxBirthday = moment().subtract(120, 'years').startOf('day');

  const formattedDate = moment(date).format('YYYY-MM-DD');

  const dateLength = formattedDate.length === 10;

  return dateLength && moment(formattedDate).isBefore(today) && moment(formattedDate).isSameOrAfter(maxBirthday);
};
