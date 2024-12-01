import { TUser } from '@/@types';
import { UsersService } from '@/database/services';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';

export class UsersController {
  // GET: /users
  public static async findAll(req: Request, res: Response): Promise<Response<TUser[]>> {
    try {
      const users = await UsersService.getAll();

      if (!users) {
        return res.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhum usuário encontrado'
        });
      }

      return res.status(HttpStatus.OK).json(users);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /users/1
  public static async findById(req: Request, res: Response): Promise<Response<TUser>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const user = await UsersService.getById(parseInt(id));

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado'
        });
      }

      return res.status(HttpStatus.OK).json(user);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // POST: /users
  public static async add(req: Request, res: Response): Promise<Response<TUser>> {
    try {
      const user: TUser = req.body;

      const hasUsername = !!(await UsersService.getByUsername(user.username));

      if (hasUsername) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Nome de usuário já existente'
        });
      }

      const hasEmail = !!(await UsersService.getByEmail(user.email));

      if (hasEmail) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'E-mail já em uso'
        });
      }

      user.password = await bcrypt.hash(user.password, 10);

      const id = await UsersService.insert(user);

      if (id) {
        user.id = id;

        return res.status(HttpStatus.CREATED).json(user);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao adicionar usuário'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /users/1
  public static async update(req: Request, res: Response): Promise<Response<TUser>> {
    try {
      const { id } = req.params;
      const user: TUser = req.body;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      user.password = await bcrypt.hash(user.password, 10);

      const result = await UsersService.update(parseInt(id), user);

      if (result) {
        user.id = parseInt(id);
        return res.status(HttpStatus.OK).json(user);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao atualizar usuário'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /users/password/1
  public static async changePassword(req: Request, res: Response): Promise<Response<TUser>> {
    const { id } = req.params;
    let { newPassword } = req.body;

    newPassword = await bcrypt.hash(newPassword, 10);

    const user = await UsersService.getById(parseInt(id));
    const data = await UsersService.updatePassword(parseInt(id), newPassword);

    if (user && data) {
      user.password = newPassword;
      return res.status(HttpStatus.OK).json(user);
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }

  // DELETE: /users/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const result = await UsersService.delete(parseInt(id));

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado'
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Usuário deletado com sucesso'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }
}
