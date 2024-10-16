import { Book } from '@/@types';
import { BooksService, RefBookGendersService } from '@/database/services';
import { HttpStatus } from '@/enums/HttpStatus';
import { Request, Response } from 'express';

interface IBookData {
  term?: string;
  limit?: string;
}

export default class BooksController {
  // GET: /books
  public static async findAll(req: Request<IBookData>, res: Response): Promise<Response<Book[]>> {
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

  // GET: /books/search
  public static async search(req: Request<IBookData>, res: Response): Promise<Response<Book[]>> {
    try {
      const { term } = req.query;

      const books = await BooksService.search(term?.toString());

      for (const book of books) {
        if (book.id) {
          book.genders = await RefBookGendersService.getByBook(book.id);
        }

        //book.cover = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn_13}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
        book.cover = `https://covers.openlibrary.org/b/isbn/${book.isbn_13}-M.jpg?default=false`;
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
  public static async findById(req: Request, res: Response): Promise<Response<Book>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const book = await BooksService.getById(parseInt(id));

      if (!book) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Livro não encontrado'
        });
      }

      return res.status(HttpStatus.OK).json(book);
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // POST: /books
  public static async add(req: Request, res: Response): Promise<Response<Book>> {
    try {
      const book: Book = req.body;

      const existingBook = await BooksService.getByISBN(book);

      if (existingBook) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Livro já cadastrado'
        });
      }

      const id = await BooksService.insert(book);

      if (id) {
        book.id = id;

        return res.status(HttpStatus.CREATED).json(book);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao adicionar livro'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // PUT: /books/1
  public static async update(req: Request, res: Response): Promise<Response<Book>> {
    try {
      const { id } = req.params;
      const book: Book = req.body;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const result = await BooksService.update(parseInt(id), book);

      if (result) {
        book.id = parseInt(id);
        return res.status(HttpStatus.OK).json(book);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao atualizar o livro'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }

  // DELETE: /books/1
  public static async delete(req: Request, res: Response): Promise<Response<Book>> {
    try {
      const { id } = req.params;

      if (!id || !parseInt(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Parâmetro inválido'
        });
      }

      const result = await BooksService.delete(parseInt(id));

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Livro não encontrado'
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Livro deletado com sucesso'
      });
    } catch (err: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message
      });
    }
  }
}
