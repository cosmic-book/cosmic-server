import { THistory } from '@/@types';
import { EditionsService, HistoriesService, ReadingsService } from '@/database/_services';
import { ReadingStatus } from '@/enums';
import { HttpStatus } from '@/enums/HttpStatus';
import { Request, Response } from 'express';

export class HistoriesController {
  // GET: /histories
  public static async findAll(req: Request, res: Response): Promise<Response<THistory[]>> {
    try {
      const { limit } = req.query;

      const histories = await HistoriesService.getAll(limit?.toString());

      if (!histories) {
        return res.status(HttpStatus.NO_CONTENT).json({ message: 'Nenhum registro de leitura encontrado' });
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
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const histories = await HistoriesService.getByReading(id);

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
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const history = await HistoriesService.getById(id);

      if (!history) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Registro de leitura não encontrado' });
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

      if (!id) {
        throw new Error('Erro ao adicionar registro de leitura');
      }

      history.id = id;

      await HistoriesController.updateHistoryReading(history);

      return res.status(HttpStatus.CREATED).json(history);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /histories/1
  public static async update(req: Request, res: Response): Promise<Response<THistory>> {
    try {
      const id = parseInt(req.params.id);
      const history: THistory = req.body;

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasHistory = !!(await HistoriesService.getById(id));

      if (!hasHistory) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Registro de Leitura não encontrado' });
      }

      await HistoriesController.updateHistoryReading(history);

      const result = await HistoriesService.update(id, history);

      if (!result) {
        throw new Error('Erro ao atualizar registro de leitura');
      }

      history.id = id;

      return res.status(HttpStatus.OK).json(history);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /histories/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      // First update reading
      const history = await HistoriesService.getById(id);

      if (!history) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Gênero não encontrado' });
      }

      await ReadingsService.updatePagesToLast(history.id_reading);

      // Then delete
      const isDeleted = await HistoriesService.delete(id);

      if (!isDeleted) {
        throw new Error('Erro ao deletar gênero');
      }

      return res.status(HttpStatus.OK).json({ message: 'Registro deletado com sucesso' });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  private static async updateHistoryReading(history: THistory): Promise<void> {
    const reading = await ReadingsService.getById(history.id_reading);

    if (reading) {
      const edition = await EditionsService.getById(reading.id_edition);

      if (reading.status === ReadingStatus.TO_READ) {
        reading.status = ReadingStatus.READING;
        reading.start_date = new Date();
      }

      if (edition && history.read_pages === edition.num_pages) {
        reading.status = ReadingStatus.FINISHED;
        reading.finish_date = new Date();
      }

      reading.read_pages = history.read_pages;

      await ReadingsService.update(reading.id, reading);
    }
  }
}
