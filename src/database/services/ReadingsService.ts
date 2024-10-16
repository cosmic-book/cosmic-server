import { Reading } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.readings;

export default class ReadingsService {
  public static async getAll(limit: string = '300'): Promise<Reading[]> {
    return Knex(table).select('*').limit(parseInt(limit));
  }

  public static async getById(id: number): Promise<Reading | undefined> {
    const [result] = await Knex(table).select('*').where('id', id);

    return result || undefined;
  }

  public static async insert(reading: Reading): Promise<number | undefined> {
    const [result] = await Knex(table).insert(reading);

    return result || undefined;
  }

  public static async update(id: number, reading: Reading): Promise<number | undefined> {
    const result = await Knex(table).update(reading).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id', id);

    return result || undefined;
  }

  public static async isAdded(id_user: number, id_book: number): Promise<boolean> {
    const [result] = await Knex(table).select('*').where('id_user', id_user).andWhere('id_book', id_book);

    return !!result;
  }
}
