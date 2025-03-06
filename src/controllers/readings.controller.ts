import { TReading } from '@/@types';
import { EditionsService, ReadingsService, UsersService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { Request, Response } from 'express';

type TBookDetails = {
  totalReadPages: number;
  totalReviews: number;
};

export class ReadingsController {
  // GET: /readings
  public static async findAll(req: Request, res: Response): Promise<Response<TReading[]>> {
    try {
      const { limit } = req.query;

      const readings = await ReadingsService.getAll(limit?.toString());

      if (!readings) {
        return res.status(HttpStatus.NO_CONTENT).json({ message: 'Nenhuma leitura encontrada' });
      }

      return res.status(HttpStatus.OK).json({
        readings,
        totalItems: readings.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /readings/user/1
  public static async findByUser(req: Request, res: Response): Promise<Response<TReading[]>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasUser = !!(await UsersService.getById(id));

      if (!hasUser) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Usuário não encontrado' });
      }

      const readings = await ReadingsService.getByUser(id);

      const { totalReadPages, totalReviews } = await ReadingsController.getBookDetails(readings);

      return res.status(HttpStatus.OK).json({
        readings,
        totalReadPages,
        totalReviews,
        totalItems: readings.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /readings/favorite/1
  public static async findFavoritesByUser(req: Request, res: Response): Promise<Response<TReading[]>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasUser = !!(await UsersService.getById(id));

      if (!hasUser) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Usuário não encontrado' });
      }

      const favorites = await ReadingsService.getFavoritesByUser(id);

      await ReadingsController.getBookDetails(favorites);

      return res.status(HttpStatus.OK).json({
        favorites,
        totalItems: favorites.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /readings/1
  public static async findById(req: Request, res: Response): Promise<Response<TReading>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const reading = await ReadingsService.getById(id);

      if (!reading) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Leitura não encontrada' });
      }

      const edition = await EditionsService.getById(reading.id_edition);

      if (edition && edition.id) {
        edition.cover = `https://covers.openlibrary.org/b/isbn/${edition.isbn_13}-M.jpg?default=false`;

        reading.edition = edition;
      }

      return res.status(HttpStatus.OK).json(reading);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // POST: /readings
  public static async add(req: Request, res: Response): Promise<Response<TReading>> {
    try {
      const reading: TReading = req.body;

      const existingItem = await ReadingsService.doesExist(reading.id_user, reading.id_edition);

      if (existingItem) {
        return res.status(HttpStatus.CONFLICT).json({ message: 'Leitura já presente na estante' });
      }

      const id = await ReadingsService.insert(reading);

      if (!id) {
        throw new Error('Erro ao adicionar leitura');
      }

      reading.id = id;

      return res.status(HttpStatus.CREATED).json(reading);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /readings/1
  public static async update(req: Request, res: Response): Promise<Response<TReading>> {
    try {
      const id = parseInt(req.params.id);
      const reading: TReading = req.body;

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasReading = !!(await ReadingsService.getById(id));

      if (!hasReading) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Leitura não encontrada' });
      }

      const result = await ReadingsService.update(id, reading);

      if (!result) {
        throw new Error('Erro ao atualizar leitura');
      }

      reading.id = id;

      return res.status(HttpStatus.OK).json(reading);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /readings/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasReading = !!(await ReadingsService.getById(id));

      if (!hasReading) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Leitura não encontrada' });
      }

      const isDeleted = await ReadingsService.delete(id);

      if (!isDeleted) {
        throw new Error('Erro ao deletar leitura');
      }

      return res.status(HttpStatus.OK).json({ message: 'Leitura deletada com sucesso' });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  private static async getBookDetails(readings: TReading[]): Promise<TBookDetails> {
    let totalReadPages = 0;
    let totalReviews = 0;

    if (readings) {
      for (const reading of readings) {
        const edition = await EditionsService.getById(reading.id_edition);

        if (edition && edition.id) {
          edition.cover = `https://covers.openlibrary.org/b/isbn/${edition.isbn_13}-M.jpg?default=false`;

          reading.edition = edition;
        }

        if (reading.read_pages) {
          totalReadPages += reading.read_pages;
        }

        if (reading.review) {
          totalReviews++;
        }
      }
    }

    return { totalReadPages, totalReviews };
  }
}
