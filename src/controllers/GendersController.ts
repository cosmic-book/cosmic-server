import { Gender } from '@/@types';
import { GendersService } from '@/database/services';
import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';

export default class GendersController {
  // GET: /genders
  public static async findAll(req: Request, res: Response): Promise<Response<Gender[]>> {
    const genders = await GendersService.getAll();

    if (!genders) return res.status(HttpStatus.NO_CONTENT).end();

    return res.status(HttpStatus.OK).json(genders);
  }

  // GET: /genders/1
  public static async findById(req: Request, res: Response): Promise<Response<Gender>> {
    const { id } = req.params;

    const gender = await GendersService.getById(parseInt(id));

    if (!gender) return res.status(HttpStatus.NOT_FOUND).end();

    return res.status(HttpStatus.OK).json(gender);
  }

  // POST: /genders
  public static async add(req: Request, res: Response): Promise<Response<Gender>> {
    const gender: Gender = req.body;

    const id = await GendersService.insert(gender);

    if (id) {
      gender.id = id;

      return res.status(HttpStatus.CREATED).json(gender);
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }

  // PUT: /genders/1
  public static async update(req: Request, res: Response): Promise<Response<Gender>> {
    const { id } = req.params;
    const gender: Gender = req.body;

    const result = await GendersService.update(parseInt(id), gender);

    if (result) {
      gender.id = parseInt(id);
      return res.status(HttpStatus.OK).json(gender);
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }

  // DELETE: /genders/1
  public static async delete(req: Request, res: Response): Promise<Response<Gender>> {
    const { id } = req.params;

    const result = await GendersService.delete(parseInt(id));

    if (!result) return res.status(HttpStatus.NOT_FOUND).end();

    return res.status(HttpStatus.OK).end();
  }
}
