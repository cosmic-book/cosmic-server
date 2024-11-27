import { THistory } from '@/@types';
import { BooksService, HistoriesService, ReadingsService, RefBookGendersService } from '@/database/services';
import { HttpStatus } from '@/enums/HttpStatus';
import { Request, Response } from 'express';

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
          message: 'Nenhum histórico de leitura encontrado'
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
  public static async findByReading(req: Request, res: Response): Promise<Response<THistory | THistory[]>> {
    try {
      const { id } = req.params;
      const { last } = req.query;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      if (!last) {
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
      }

      const history = await HistoriesService.getLastByReading(parseInt(id));

      if (!history) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Histórico de Leitura não encontrado'
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
          message: 'Histórico de Leitura não encontrado'
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

        return res.status(HttpStatus.CREATED).json(history);
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

      const result = await HistoriesService.update(parseInt(id), history);

      if (result) {
        history.id = parseInt(id);

        return res.status(HttpStatus.OK).json(history);
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

  // DELETE: /histories/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const result = await HistoriesService.delete(parseInt(id));

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
