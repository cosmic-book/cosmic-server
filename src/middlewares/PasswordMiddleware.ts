import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '@/enums/HttpStatus';
import { UsersService } from '@/database/services';
import bcrypt from 'bcrypt';

export default async function PasswordMiddleware(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  let { password, newPassword, confirmPass } = req.body;

  const user = await UsersService.getById(parseInt(id));

  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'Usuário não encontrado' });
  }

  if (!password || !newPassword || !confirmPass) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Informações incompletas' });
  }

  const isActualPass = await bcrypt.compare(password, user.password);

  if (!isActualPass) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Senha atual inválida' });
  }

  if (newPassword === password) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Nova senha não pode ser igual à atual' });
  }

  if (newPassword !== confirmPass) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Campos não conferem' });
  }

  if (newPassword.length < 8 && confirmPass.length < 8) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'A nova senha precisa conter no mínimo 8 caracteres'
    });
  }

  next();
}
