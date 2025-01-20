import { TBook } from '@/@types';
import { BooksService, RefBookGendersService } from '@/database/_services';
import { HttpStatus } from '@/enums/HttpStatus';
import axios from 'axios';
import { Request, Response } from 'express';

interface IBookData {
  term?: string;
  limit?: string;
}

export class BooksController {
  // GET: /books
  public static async findAll(req: Request<IBookData>, res: Response): Promise<Response<TBook[]>> {
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
  public static async search(req: Request<IBookData>, res: Response): Promise<Response<TBook[]>> {
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

  // GET: /books/search/v2
  public static async searchOpenLibrary(req: Request<IBookData>, res: Response): Promise<Response<any>> {
    try {
      let term = req.query.term?.toString();

      if (!term) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Parâmetro inválido' });
      }

      term = term.trim().replace(/\s/g, '+');

      const response = await axios.get(`https://openlibrary.org/search.json?q=${term}&language=por`);

      if (!response.data.docs || response.data.docs.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Nenhum livro encontrado' });
      }

      const book = response.data.docs[0];

      if (!book.edition_key || book.edition_key.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Nenhuma edição encontrada' });
      }

      // Consulta todas as edições em paralelo
      const editionsData = await Promise.all(
        book.edition_key.map(
          async (edition: any) =>
            await axios
              .get(`https://openlibrary.org/books/${edition}.json`)
              .catch(() => console.log(`Erro ao buscar edição: ${edition}`))
        )
      );

      const editions = editionsData.filter((result) => result?.data).map((result) => result!.data);

      // Filtra edições que suportam o idioma português
      const filteredEdit = editions.filter((edition) =>
        edition.languages?.some((lang: { key: string }) => lang.key.trim().toLowerCase() === '/languages/por')
      );

      if (filteredEdit.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Nenhuma edição encontrada em português' });
      }

      // Mapeando apenas as edições em português
      const books: Partial<TBook>[] = filteredEdit.map((edition: any) => ({
        title: edition?.title,
        author: book.author_name?.join(', ') || 'Autor desconhecido',
        year: edition?.publish_date,
        pages: edition.number_of_pages,
        isbn_10: edition.isbn_10?.[0],
        isbn_13: edition.isbn_13?.[0],
        description: edition?.description || '',
        language: 'Português',
        publisher: edition.publishers?.[0],
        cover: edition.covers ? `https://covers.openlibrary.org/b/id/${edition.covers[0]}-L.jpg` : undefined
      }));

      return res.status(HttpStatus.OK).json(books);
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

      const existingBook = !!(await BooksService.getByISBN(book));

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
  public static async delete(req: Request, res: Response): Promise<Response> {
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
