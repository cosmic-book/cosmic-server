import { TAuthor } from '@/@types';
import { AuthorsService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { IFilterModel } from '@/interfaces';
import { Request, Response } from 'express';

export class AuthorsController {
  // GET: /authors
  public static async findAll(req: Request<IFilterModel>, res: Response): Promise<Response<TAuthor[]>> {
    try {
      const { limit } = req.query;

      const authors = await AuthorsService.getAll(limit?.toString());

      if (!authors) {
        return res.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhum autor encontrado'
        });
      }

      return res.status(HttpStatus.OK).json({
        authors,
        totalItems: authors.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /authors/search
  public static async search(req: Request<IFilterModel>, res: Response): Promise<Response<TAuthor[]>> {
    try {
      const term = req.query.term?.toString();

      if (!term) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const authors = await AuthorsService.search(term?.toString());

      for (const author of authors) {
        author.photo = `https://covers.openlibrary.org/a/olid/${author.ol_author_key}-M.jpg?default=false`;
      }

      return res.status(HttpStatus.OK).json({
        authors,
        totalItems: authors.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /authors/1
  public static async findById(req: Request, res: Response): Promise<Response<TAuthor>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const author = await AuthorsService.getById(id);

      if (!author) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Autor não encontrado' });
      }

      return res.status(HttpStatus.OK).json(author);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // POST: /authors
  public static async add(req: Request, res: Response): Promise<Response<TAuthor>> {
    try {
      const author: TAuthor = req.body;

      const id = await AuthorsService.insert(author);

      if (!id) {
        throw new Error('Erro ao adicionar autor');
      }

      author.id = id;

      return res.status(HttpStatus.CREATED).json(author);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /authors/1
  public static async update(req: Request, res: Response): Promise<Response<TAuthor>> {
    try {
      const id = parseInt(req.params.id);
      const author: TAuthor = req.body;

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasAuthor = !!(await AuthorsService.getById(id));

      if (!hasAuthor) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Autor não encontrado' });
      }

      const result = await AuthorsService.update(id, author);

      if (!result) {
        throw new Error('Erro ao atualizar autor');
      }

      author.id = id;

      return res.status(HttpStatus.OK).json(author);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /authors/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasAuthor = !!(await AuthorsService.getById(id));

      if (!hasAuthor) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Autor não encontrado' });
      }

      const isDeleted = await AuthorsService.delete(id);

      if (!isDeleted) {
        throw new Error('Erro ao deletar autor');
      }

      return res.status(HttpStatus.OK).json({ message: 'Autor deletado com sucesso' });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }
}
