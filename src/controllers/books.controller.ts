import { TBook } from '@/@types';
import { BooksService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import { IFilterModel } from '@/interfaces';
import { Request, Response } from 'express';

export class BooksController {
  // GET: /books
  public static async findAll(req: Request<IFilterModel>, res: Response): Promise<Response<TBook[]>> {
    try {
      const { limit } = req.query;

      const books = await BooksService.getAll(limit?.toString());

      if (!books) {
        return res.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhum livro encontrado'
        });
      }

      return res.status(HttpStatus.OK).json({
        books,
        totalItems: books.length
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // GET: /books/1
  public static async findById(req: Request, res: Response): Promise<Response<TBook>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const book = await BooksService.getById(id);

      if (!book) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Livro não encontrado' });
      }

      return res.status(HttpStatus.OK).json(book);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // POST: /books
  public static async add(req: Request, res: Response): Promise<Response<TBook>> {
    try {
      const book: TBook = req.body;

      const existingBook = !!(await BooksService.getById(book.id));

      if (existingBook) {
        return res.status(HttpStatus.CONFLICT).json({ message: 'Livro já cadastrado' });
      }

      const id = await BooksService.insert(book);

      if (!id) {
        throw new Error('Erro ao adicionar livro');
      }

      book.id = id;

      return res.status(HttpStatus.CREATED).json(book);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /books/1
  public static async update(req: Request, res: Response): Promise<Response<TBook>> {
    try {
      const id = parseInt(req.params.id);
      const book: TBook = req.body;

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasBook = !!(await BooksService.getById(id));

      if (!hasBook) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Livro não encontrado' });
      }

      const result = await BooksService.update(id, book);

      if (!result) {
        throw new Error('Erro ao atualizar livro');
      }

      book.id = id;

      return res.status(HttpStatus.OK).json(book);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /books/1
  public static async delete(req: Request, res: Response): Promise<Response<void>> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      const hasBook = !!(await BooksService.getById(id));

      if (!hasBook) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Livro não encontrado' });
      }

      const isDeleted = await BooksService.delete(id);

      if (!isDeleted) {
        throw new Error('Erro ao deletar livro');
      }

      return res.status(HttpStatus.OK).json({ message: 'Livro deletado com sucesso' });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }
}
