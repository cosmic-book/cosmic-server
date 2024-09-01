import { User } from '@/@types';
import { UsersService } from '@/database/services';
import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';
import bcrypt from 'bcrypt';
import moment from 'moment';

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

  // POST: /users/login
  public static async login(req: Request, res: Response): Promise<Response<User>> {
    const { username, password } = req.body;

    if (username && password) {
      const user = await UsersService.getByUsername(username);

      if (!user) return res.status(HttpStatus.NOT_FOUND).end();

      const compare = await bcrypt.compare(password, user.password);

      if (compare) return res.status(HttpStatus.OK).json(user);
    }

    return res.status(HttpStatus.BAD_REQUEST).end();
  }

  // POST: /users
  public static async add(req: Request, res: Response): Promise<Response<User>> {
    const user: User = req.body;

    const hasUsername = !!(await UsersService.getByUsername(user.username));

    if (hasUsername) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Username já existente' });
    }

    const hasEmail = !!(await UsersService.getByEmail(user.email));

    if (hasEmail) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'E-mail já em uso' });
    }

    var date = moment(user.birthday, 'DD/MM/YYYY').toDate();

    if (date.toString() === 'Invalid Date') {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Data inválida' });
    }

    user.birthday = date;
    user.password = await bcrypt.hash(user.password, 10);

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

    user.password = await bcrypt.hash(user.password, 10);

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
