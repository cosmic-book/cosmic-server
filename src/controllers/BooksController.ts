import { Book } from '@/@types';
import { BooksService } from '@/database/services';
import { Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';

export default class BooksController {
  // GET: /books
  public static async findAll(req: Request, res: Response): Promise<Response<Book[]>> {
    const books = await BooksService.getAll();

    if (!books) return res.status(HttpStatus.NO_CONTENT).end();

    return res.status(HttpStatus.OK).json(books);
  }

  // GET: /books/1
  public static async findById(req: Request, res: Response): Promise<Response<Book>> {
    const { id } = req.params;

    const book = await BooksService.getById(parseInt(id));

    if (!book) return res.status(HttpStatus.NOT_FOUND).end();

    return res.status(HttpStatus.OK).json(book);
  }

  // POST: /books
  public static async add(req: Request, res: Response): Promise<Response<Book>> {
    const book: Book = req.body;

    const id = await BooksService.insert(book);

    if (id) {
      book.id = id;

      return res.status(HttpStatus.CREATED).json(book);
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }

  // PUT: /books/1
  public static async update(req: Request, res: Response): Promise<Response<Book>> {
    const { id } = req.params;
    const book: Book = req.body;

    const result = await BooksService.update(parseInt(id), book);

    if (result) {
      book.id = parseInt(id);
      return res.status(HttpStatus.OK).json(book);
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }

  // DELETE: /books/1
  public static async delete(req: Request, res: Response): Promise<Response<Book>> {
    const { id } = req.params;

    const result = await BooksService.delete(parseInt(id));

    if (!result) return res.status(HttpStatus.NOT_FOUND).end();

    return res.status(HttpStatus.OK).end();
  }
}
