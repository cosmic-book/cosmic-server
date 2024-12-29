import { UsersService } from '@/database/_services';
import { generateToken } from '@/utils/authUtils';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';

export class AuthController {
  // POST: /auth/login
  public static async login(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { username, password } = req.body;

      if (username && password) {
        const user = await UsersService.getByUsername(username);

        if (!user) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: 'Usuário não encontrado'
          });
        }

        const compare = await bcrypt.compare(password, user.password);

        if (!compare) {
          return res.status(HttpStatus.CONFLICT).json({
            message: 'Senha inválida'
          });
        }

        const { token, exp } = generateToken(user);

        return res.status(HttpStatus.OK).json({ token, exp, user });
      }

      return res.status(HttpStatus.BAD_REQUEST).end();
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }
}
