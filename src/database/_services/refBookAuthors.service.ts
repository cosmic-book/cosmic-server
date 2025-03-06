import { TRefBookAuthor } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.refBookAuthors;

export class RefBookAuthorsService {
  public static async getAll(): Promise<TRefBookAuthor[]> {
    return Knex(table).select('*');
  }

  public static async getByBook(id_book: number): Promise<TRefBookAuthor[]> {
    const result = await Knex(table).select('*').where('id_book', id_book);

    return result || undefined;
  }

  public static async getByAuthor(id_author: number): Promise<TRefBookAuthor[]> {
    const result = await Knex(table).select('*').where('id_author', id_author);

    return result || undefined;
  }

  public static async insert(refBookAuthor: TRefBookAuthor): Promise<number | undefined> {
    const [result] = await Knex(table).insert(refBookAuthor);

    return result || undefined;
  }

  public static async deleteByBook(id_book: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id_book', id_book);

    return result || undefined;
  }

  public static async deleteByAuthor(id_author: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id_author', id_author);

    return result || undefined;
  }
}
