import { TReading } from '@/@types';
import { BooksService, ReadingsService, RefBookGendersService } from '@/database/services';
import { HttpStatus } from '@/enums/HttpStatus';
import { Request, Response } from 'express';

export class ReadingsController {
  // GET: /readings
  public static async findAll(req: Request, res: Response): Promise<Response<TReading[]>> {
    try {
      const { limit } = req.query;

      const readings = await ReadingsService.getAll(limit?.toString());

      if (!readings) {
        return res.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhuma leitura encontrada'
        });
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
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const readings = await ReadingsService.getByUser(parseInt(id));

      let totalReadPages = 0;
      let totalReviews = 0;

      if (readings) {
        for (const reading of readings) {
          const book = await BooksService.getById(reading.id_book);

          if (book && book.id) {
            book.genders = await RefBookGendersService.getByBook(book.id);
            book.cover = `https://covers.openlibrary.org/b/isbn/${book.isbn_13}-M.jpg?default=false`;

            reading.book = book;
          }

          if (reading.read_pages) {
            totalReadPages += reading.read_pages;
          }

          if (reading.review) {
            totalReviews++;
          }
        }
      }

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

  // GET: /readings/1
  public static async findById(req: Request, res: Response): Promise<Response<TReading>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const reading = await ReadingsService.getById(parseInt(id));

      if (!reading) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Leitura não encontrada'
        });
      }

      const book = await BooksService.getById(reading.id_book);

      if (book && book.id) {
        book.genders = await RefBookGendersService.getByBook(book.id);
        book.cover = `https://covers.openlibrary.org/b/isbn/${book.isbn_13}-M.jpg?default=false`;

        reading.book = book;
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

      const existingItem = await ReadingsService.isAdded(reading.id_user, reading.id_book);

      if (existingItem) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Leitura já presente na estante'
        });
      }

      const id = await ReadingsService.insert(reading);

      if (id) {
        reading.id = id;

        return res.status(HttpStatus.CREATED).json(reading);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao adicionar leitura na estante'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /readings/1
  public static async update(req: Request, res: Response): Promise<Response<TReading>> {
    try {
      const { id } = req.params;
      const reading: TReading = req.body;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const result = await ReadingsService.update(parseInt(id), reading);

      if (result) {
        reading.id = parseInt(id);

        return res.status(HttpStatus.OK).json(reading);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao atualizar a leitura da estante'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /readings/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const result = await ReadingsService.delete(parseInt(id));

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Leitura não encontrada'
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Leitura deletada com sucesso'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }
}
