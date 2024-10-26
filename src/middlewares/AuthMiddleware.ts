import { HttpStatus } from '@/enums/HttpStatus';
import { checkToken } from '@/utils/authUtils';
import { NextFunction, Request, Response } from 'express';

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const nonAuthPath = [{ url: '/users', method: 'POST' }];

  const path = nonAuthPath.find((p) => {
    return p.url === req.originalUrl && p.method === req.method;
  });

  if (path) return next();

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'Credenciais não encontradas' });
  }

  if (!checkToken(token)) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Credenciais inválidas' });
  }

  next();
}
