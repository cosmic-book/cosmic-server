import { Gender } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.genders;

export default class GendersService {
  public static async getAll(): Promise<Gender[]> {
    return Knex(table).select('*');
  }

  public static async getById(id: number): Promise<Gender | undefined> {
    const [result] = await Knex(table).select('*').where('id', id);

    return result || undefined;
  }

  public static async insert(book: Gender): Promise<number | undefined> {
    const [result] = await Knex(table).insert(book);

    return result || undefined;
  }

  public static async update(id: number, book: Gender): Promise<number | undefined> {
    const result = await Knex(table).update(book).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id', id);

    return result || undefined;
  }
}
