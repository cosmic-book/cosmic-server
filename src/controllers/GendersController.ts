import { Gender } from '@/@types';
import { GendersService } from '@/database/services';
import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';

export default class GendersController {
  // GET: /genders
  public static async findAll(req: Request, res: Response): Promise<Response<Gender[]>> {
    try {
      const genders = await GendersService.getAll();

      if (!genders) {
        return res.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhum gênero encontrado'
        });
      }

      return res.status(HttpStatus.OK).json(genders);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /genders/1
  public static async findById(req: Request, res: Response): Promise<Response<Gender>> {
    try {
      const { id } = req.params;

      const gender = await GendersService.getById(parseInt(id));

      if (!gender) {
        return res.status(HttpStatus.NO_CONTENT).json({
          message: 'Gênero não encontrado'
        });
      }

      return res.status(HttpStatus.OK).json(gender);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // POST: /genders
  public static async add(req: Request, res: Response): Promise<Response<Gender>> {
    try {
      const gender: Gender = req.body;

      const existingGender = await GendersService.getByName(gender.name);

      if (existingGender) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Gênero já cadastrado'
        });
      }

      const id = await GendersService.insert(gender);

      if (id) {
        gender.id = id;

        return res.status(HttpStatus.CREATED).json(gender);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao adicionar gênero'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /genders/1
  public static async update(req: Request, res: Response): Promise<Response<Gender>> {
    try {
      const { id } = req.params;
      const gender: Gender = req.body;

      const result = await GendersService.update(parseInt(id), gender);

      if (result) {
        gender.id = parseInt(id);
        return res.status(HttpStatus.OK).json(gender);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao atualizar gênero'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /genders/1
  public static async delete(req: Request, res: Response): Promise<Response<Gender>> {
    try {
      const { id } = req.params;

      const result = await GendersService.delete(parseInt(id));

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Gênero não encontrado'
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Gênero deletado com sucesso'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }
}
