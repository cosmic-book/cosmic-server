import { Book } from '@/@types';
import { BooksService } from '@/database/services';
import { HttpStatus } from '@/enums/HttpStatus';
import { Request, Response } from 'express';
import { readFile } from 'fs/promises';

interface IBookData {
  limit: string;
}

export default class BooksController {
  // GET: /books
  public static async findAll(req: Request<IBookData>, res: Response): Promise<Response<Book[]>> {
    const { limit } = req.query;

    const books = await BooksService.getAll(limit?.toString());

    if (!books) return res.status(HttpStatus.NO_CONTENT).end();

    return res.status(HttpStatus.OK).json({ books, totalItems: books.length });
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

  // POST: /books/all
  public static async addAll(req: Request, res: Response): Promise<Response<Book>> {
    const books: Book[] = [];

    const data: any[] = JSON.parse(await readFile('./src/json/data.json', 'utf8'));

    for (const item of data) {
      const book: Book = {
        id: 0,
        title: item.titulo,
        author: item.autor,
        year: item.ano,
        pages: item.paginas,
        isbn_13: item.ISBN_13,
        isbn_10: item.ISBN_10,
        description: item.descricao.toString(),
        language: item.idioma,
        publisher: item.editora
      };

      const exists = await BooksService.getByISBN(book);

      if (exists) continue;

      try {
        const id = await BooksService.insert(book);

        if (id) {
          book.id = id;

          books.push(book);
        }
      } catch (error) {
        console.log('Error adding book. ISBN_13:', book.isbn_13);

        continue;
      }
    }

    if (books.length > 0) {
      return res.status(HttpStatus.CREATED).json(books);
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
