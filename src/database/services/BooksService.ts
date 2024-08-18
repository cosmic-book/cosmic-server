import { Book } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';
import dotenv from 'dotenv';

dotenv.config({ path: '../../../.env' });

const table = TableNames.books;

export default class BookService {
  public static async getAll(): Promise<Book[]> {
    return Knex(table).select('*');
  }

  public static async getById(id: number): Promise<Book | undefined> {
    const [result] = await Knex(table).select('*').where('id', id);

    return result || undefined;
  }

  public static async insert(book: Book): Promise<number | undefined> {
    const [result] = await Knex(table).insert(book).returning('id');

    return result.id || undefined;
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
