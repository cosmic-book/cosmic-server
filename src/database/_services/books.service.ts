import { TBook } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.books;

export class BooksService {
  public static async getAll(limit: string = '300'): Promise<TBook[]> {
    return Knex(table).select('*').where('is_deleted', false).limit(parseInt(limit));
  }

  public static async getById(id: number): Promise<TBook | undefined> {
    const [result] = await Knex(table).select('*').where('id', id).andWhere('is_deleted', false);

    return result || undefined;
  }

  public static async getByISBN(book: TBook): Promise<TBook | undefined> {
    const [result] = await Knex(table)
      .select('*')
      .where('isbn_13', book.isbn_13)
      .orWhere('isbn_10', book.isbn_10)
      .andWhere('is_deleted', false);

    return result || undefined;
  }

  public static async search(term?: string): Promise<Partial<TBook>[]> {
    const result = await Knex(table)
      .select('*')
      .where('title', 'like', `%${term}%`)
      .orWhere('author', 'like', `%${term}%`)
      .andWhere('is_deleted', false);

    return result;
  }

  public static async insert(book: TBook): Promise<number | undefined> {
    const [result] = await Knex(table).insert(book);

    return result || undefined;
  }

  public static async update(id: number, book: TBook): Promise<number | undefined> {
    const result = await Knex(table).update(book).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).update({ is_deleted: true }).where('id', id);

    return result || undefined;
  }
}
