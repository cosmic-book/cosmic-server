import { TReading } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.readings;

export class ReadingsService {
  public static async getAll(limit: string = '300'): Promise<TReading[]> {
    return Knex(table).select('*').limit(parseInt(limit));
  }

  public static async getByUser(user_id: number): Promise<TReading[]> {
    return Knex(table).select('*').where('id_user', user_id);
  }

  public static async getFavoritesByUser(user_id: number): Promise<TReading[]> {
    return Knex(table).select('*').where('id_user', user_id).andWhere('favorite', true);
  }

  public static async getById(id: number): Promise<TReading | undefined> {
    const [result] = await Knex(table).select('*').where('id', id);

    return result || undefined;
  }

  public static async insert(reading: TReading): Promise<number | undefined> {
    const [result] = await Knex(table).insert(reading);

    return result || undefined;
  }

  public static async update(id: number, reading: TReading): Promise<number | undefined> {
    const result = await Knex(table).update(reading).where('id', id);

    return result || undefined;
  }

  public static async updatePages(id: number, pages: number): Promise<number | undefined> {
    const result = await Knex(table).update('read_pages', pages).where('id', id);

    return result || undefined;
  }

  public static async updatePagesToLast(id: number): Promise<number | undefined> {
    const [history] = await Knex(TableNames.histories).where('id_reading', id).orderBy('date', 'desc').limit(1);

    const result = this.updatePages(id, history ? history.read_pages : 0);

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
