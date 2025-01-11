import { TGender } from '@/@types';
import { GendersService } from '@/database/_services';
import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';

export class GendersController {
  // GET: /genders
  public static async findAll(req: Request, res: Response): Promise<Response<TGender[]>> {
    try {
      const genders = await GendersService.getAll();

      if (!genders) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Nenhum gênero encontrado' });
      }

      return res.status(HttpStatus.OK).json(genders);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /genders/names?ids=1,2,3
  public static async getGendersName(req: Request, res: Response): Promise<Response<TGender>> {
    try {
      let { ids } = req.query;

      if (ids) {
        ids = ids.toString().split(',');

        let names: string[] = [];

        for (const id of ids) {
          const gender = await GendersService.getById(parseInt(id));

          if (gender) {
            names.push(gender.name);
          }
        }

        if (!names.length) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: 'Gêneros não encontrados' });
        }

        return res.status(HttpStatus.OK).json(names);
      }

      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Erro ao encontrar gêneros' });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /genders/1
  public static async findById(req: Request, res: Response): Promise<Response<TGender>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const gender = await GendersService.getById(id);

      if (!gender) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Gênero não encontrado' });
      }

      return res.status(HttpStatus.OK).json(gender);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // POST: /genders
  public static async add(req: Request, res: Response): Promise<Response<TGender>> {
    try {
      const gender: TGender = req.body;

      const existingGender = await GendersService.getByName(gender.name);

      if (existingGender) {
        return res.status(HttpStatus.CONFLICT).json({ message: 'Gênero já cadastrado' });
      }

      const id = await GendersService.insert(gender);

      if (!id) {
        throw new Error('Erro ao adicionar gênero');
      }

      gender.id = id;

      return res.status(HttpStatus.CREATED).json(gender);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /genders/1
  public static async update(req: Request, res: Response): Promise<Response<TGender>> {
    try {
      const id = parseInt(req.params.id);
      const gender: TGender = req.body;

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasGender = !!(await GendersService.getById(id));

      if (!hasGender) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Gênero não encontrado' });
      }

      const result = await GendersService.update(id, gender);

      if (!result) {
        throw new Error('Erro ao atualizar gênero');
      }

      gender.id = id;

      return res.status(HttpStatus.OK).json(gender);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /genders/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasGender = !!(await GendersService.getById(id));

      if (!hasGender) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Gênero não encontrado' });
      }

      const isDeleted = await GendersService.delete(id);

      if (!isDeleted) {
        throw new Error('Erro ao deletar gênero');
      }

      return res.status(HttpStatus.OK).json({ message: 'Gênero deletado com sucesso' });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }
}
