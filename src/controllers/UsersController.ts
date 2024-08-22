import { User } from '@/@types';
import { UsersService } from '@/database/services';
import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';

export default class UsersController {
  // GET: /users
  public static async findAll(req: Request, res: Response): Promise<Response<User[]>> {
    const users = await UsersService.getAll();

    if (!users) return res.status(HttpStatus.NO_CONTENT).end();

    return res.status(HttpStatus.OK).json(users);
  }

  // GET: /users/1
  public static async findById(req: Request, res: Response): Promise<Response<User>> {
    const { id } = req.params;

    const user = await UsersService.getById(parseInt(id));

    if (!user) return res.status(HttpStatus.NOT_FOUND).end();

    return res.status(HttpStatus.OK).json(user);
  }

  // POST: /users
  public static async add(req: Request, res: Response): Promise<Response<User>> {
    const user: User = req.body;

    const id = await UsersService.insert(user);

    if (id) {
      user.id = id;

      return res.status(HttpStatus.CREATED).json(user);
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }

  // PUT: /users/1
  public static async update(req: Request, res: Response): Promise<Response<User>> {
    const { id } = req.params;
    const user: User = req.body;

    const result = await UsersService.update(parseInt(id), user);

    if (result) {
      user.id = parseInt(id);
      return res.status(HttpStatus.OK).json(user);
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }

  // DELETE: /users/1
  public static async delete(req: Request, res: Response): Promise<Response<User>> {
    const { id } = req.params;

    const result = await UsersService.delete(parseInt(id));

    if (!result) return res.status(HttpStatus.NOT_FOUND).end();

    return res.status(HttpStatus.OK).end();
  }
}
