import { Book } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.books;

export default class BooksService {
  public static async getAll(limit: string = '300'): Promise<Book[]> {
    return Knex(table).select('*').limit(parseInt(limit));
  }

  public static async getById(id: number): Promise<Book | undefined> {
    const [result] = await Knex(table).select('*').where('id', id);

    return result || undefined;
  }

  public static async getByISBN(book: Book): Promise<Book | undefined> {
    const [result] = await Knex(table).select('*').where('isbn_13', book.isbn_13).orWhere('isbn_10', book.isbn_10);

    return result || undefined;
  }

  public static async search(term?: string): Promise<Partial<Book>[]> {
    const result = await Knex(table)
      .select('id', 'title', 'author', 'isbn_13', 'publisher', 'year', 'pages')
      .where('title', 'like', `%${term}%`)
      .orWhere('author', 'like', `%${term}%`);

    return result;
  }

  public static async insert(book: Book): Promise<number | undefined> {
    const [result] = await Knex(table).insert(book);

    return result || undefined;
  }

  public static async update(id: number, book: Book): Promise<number | undefined> {
    const result = await Knex(table).update(book).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id', id);

    return result || undefined;
  }
}
