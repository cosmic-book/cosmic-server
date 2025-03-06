import { TEdition } from '@/@types';
import { EditionsService, OpenLibraryService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { IFilterModel } from '@/interfaces';
import { Request, Response } from 'express';

export class EditionsController {
  // GET: /editions
  public static async findAll(req: Request<IFilterModel>, res: Response): Promise<Response<TEdition[]>> {
    try {
      const { limit } = req.query;

      const editions = await EditionsService.getAll(limit?.toString());

      if (!editions) {
        return res.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhuma edição encontrada'
        });
      }

      return res.status(HttpStatus.OK).json({
        editions,
        totalItems: editions.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /editions/search
  public static async search(req: Request<IFilterModel>, res: Response): Promise<Response<TEdition[]>> {
    try {
      const term = req.query.term?.toString();

      if (!term) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      let editions = await EditionsService.search(term);

      if (editions.length === 0) {
        const olResponse = await OpenLibraryService.searchAndInsertEdition(term);

        if (!olResponse) {
          return res.status(HttpStatus.NO_CONTENT).json({ message: 'Nenhuma edição encontrada' });
        }

        editions = olResponse;
      }

      for (const edition of editions) {
        // if (edition.id) {
        //   edition.genders = await RefBookGendersService.getByBook(edition.id);
        // }

        edition.cover = `https://covers.openlibrary.org/b/isbn/${edition.isbn_13}-M.jpg?default=false`;
      }

      return res.status(HttpStatus.OK).json({
        editions,
        totalItems: editions.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /editions/1
  public static async findById(req: Request, res: Response): Promise<Response<TEdition>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const edition = await EditionsService.getById(id);

      if (!edition) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Edição não encontrada' });
      }

      return res.status(HttpStatus.OK).json(edition);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // POST: /editions
  public static async add(req: Request, res: Response): Promise<Response<TEdition>> {
    try {
      const edition: TEdition = req.body;

      const existingEdition = !!(await EditionsService.getByISBN(edition));

      if (existingEdition) {
        return res.status(HttpStatus.CONFLICT).json({ message: 'Edição já cadastrada' });
      }

      const id = await EditionsService.insert(edition);

      if (!id) {
        throw new Error('Erro ao adicionar edição');
      }

      edition.id = id;

      return res.status(HttpStatus.CREATED).json(edition);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /editions/1
  public static async update(req: Request, res: Response): Promise<Response<TEdition>> {
    try {
      const id = parseInt(req.params.id);
      const edition: TEdition = req.body;

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasEdition = !!(await EditionsService.getById(id));

      if (!hasEdition) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Edição não encontrada' });
      }

      const result = await EditionsService.update(id, edition);

      if (!result) {
        throw new Error('Erro ao atualizar edição');
      }

      edition.id = id;

      return res.status(HttpStatus.OK).json(edition);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /editions/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasEdition = !!(await EditionsService.getById(id));

      if (!hasEdition) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Edição não encontrada' });
      }

      const isDeleted = await EditionsService.delete(id);

      if (!isDeleted) {
        throw new Error('Erro ao deletar edição');
      }

      return res.status(HttpStatus.OK).json({ message: 'Edição deletada com sucesso' });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }
}
