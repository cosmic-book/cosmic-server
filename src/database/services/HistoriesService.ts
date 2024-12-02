import { THistory } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.histories;

export class HistoriesService {
  public static async getAll(limit: string = '300'): Promise<THistory[]> {
    return Knex(table).select('*').limit(parseInt(limit));
  }

  public static async getByReading(reading_id: number): Promise<THistory[]> {
    return Knex(table).select('*').where('id_reading', reading_id).orderBy('date', 'desc');
  }

  public static async getLastByReading(reading_id: number): Promise<THistory> {
    const [result] = await Knex(table).select('*').where('id_reading', reading_id).orderBy('date', 'desc').limit(1);

    return result || undefined;
  }

  public static async getLastByUser(user_id: number): Promise<THistory> {
    const [result] = await Knex(table).select('*').where('id_user', user_id).orderBy('date', 'desc').limit(1);

    return result || undefined;
  }

  public static async getById(id: number): Promise<THistory | undefined> {
    const [result] = await Knex(table).select('*').where('id', id);

    return result || undefined;
  }

  public static async insert(history: THistory): Promise<number | undefined> {
    const [result] = await Knex(table).insert(history);

    return result || undefined;
  }

  public static async update(id: number, history: THistory): Promise<number | undefined> {
    if (history.reading) history.reading = undefined;

    const result = await Knex(table).update(history).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id', id);

    return result || undefined;
  }
}
