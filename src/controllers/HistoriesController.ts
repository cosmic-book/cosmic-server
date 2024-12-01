import { THistory } from '@/@types';
import { BooksService, HistoriesService, ReadingsService, RefBookGendersService } from '@/database/services';
import { ReadingStatus } from '@/enums';
import { HttpStatus } from '@/enums/HttpStatus';
import { Request, Response } from 'express';
import moment from 'moment';

type TBookDetails = {
  totalReadPages: number;
  totalReviews: number;
};

export class HistoriesController {
  // GET: /histories
  public static async findAll(req: Request, res: Response): Promise<Response<THistory[]>> {
    try {
      const { limit } = req.query;

      const histories = await HistoriesService.getAll(limit?.toString());

      if (!histories) {
        return res.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhum registro de leitura encontrado'
        });
      }

      return res.status(HttpStatus.OK).json({
        histories,
        totalItems: histories.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /histories/reading/1
  public static async findByReading(req: Request, res: Response): Promise<Response<THistory[]>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const histories = await HistoriesService.getByReading(parseInt(id));

      for (const history of histories) {
        const reading = await ReadingsService.getById(history.id_reading);

        if (reading && reading.id) {
          history.reading = reading;
        }
      }

      return res.status(HttpStatus.OK).json({
        histories,
        totalItems: histories.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /histories/1
  public static async findById(req: Request, res: Response): Promise<Response<THistory>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const history = await HistoriesService.getById(parseInt(id));

      if (!history) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Registro de leitura não encontrado'
        });
      }

      const reading = await ReadingsService.getById(history.id_reading);

      if (reading && reading.id) {
        history.reading = reading;
      }

      return res.status(HttpStatus.OK).json(history);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // POST: /histories
  public static async add(req: Request, res: Response): Promise<Response<THistory>> {
    try {
      const history: THistory = req.body;

      const id = await HistoriesService.insert(history);

      if (id) {
        history.id = id;

        await this.updateHistoryReading(history);

        return res.status(HttpStatus.CREATED).json(history);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao adicionar registro de leitura'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /histories/1
  public static async update(req: Request, res: Response): Promise<Response<THistory>> {
    try {
      const { id } = req.params;
      const history: THistory = req.body;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      await this.updateHistoryReading(history);

      const result = await HistoriesService.update(parseInt(id), history);

      if (result) {
        history.id = parseInt(id);

        return res.status(HttpStatus.OK).json(history);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao atualizar registro de leitura'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /histories/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const history = await HistoriesService.getById(parseInt(id));
      const result = await HistoriesService.delete(parseInt(id));

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Registro não encontrado'
        });
      }

      if (history) {
        await ReadingsService.updatePagesToLast(history.id_reading);
      }

      return res.status(HttpStatus.OK).json({
        message: 'Registro deletado com sucesso'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  private static async updateHistoryReading(history: THistory): Promise<void> {
    const reading = await ReadingsService.getById(history.id_reading);

    if (reading) {
      const book = await BooksService.getById(reading.id_book);

      if (reading.status === ReadingStatus.TO_READ) {
        reading.status = ReadingStatus.READING;
        reading.start_date = new Date();
      }

      if (book && history.read_pages === book.pages) {
        reading.status = ReadingStatus.FINISHED;
        reading.finish_date = new Date();
      }

      reading.read_pages = history.read_pages;

      await ReadingsService.update(reading.id, reading);
    }
  }
}
