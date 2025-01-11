import { TBookshelfFilter, TReading } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.readings;

export class ReadingsService {
  public static async getAll(limit: string = '300'): Promise<TReading[]> {
    return Knex(table).select('*').where('is_deleted', false).limit(parseInt(limit));
  }

  public static async getByUser(user_id: number): Promise<TReading[]> {
    return Knex(table).select('*').where('id_user', user_id).andWhere('is_deleted', false);
  }

  public static async getByUserFiltered(user_id: number, filters: TBookshelfFilter): Promise<TReading[]> {
    return Knex(table)
      .select('*')
      .where('id_user', user_id)
      .andWhere('is_deleted', false)
      .modify((query) => {
        if (filters.category !== undefined) {
          query.andWhere('category', filters.category);
        }
        if (filters.status !== undefined) {
          query.andWhere('status', filters.status);
        }
        if (filters.type !== undefined) {
          query.andWhere('type', filters.type);
        }
        if (filters.rating !== undefined) {
          query.andWhere('rating', filters.rating);
        }
      });
  }

  public static async getFavoritesByUser(user_id: number): Promise<TReading[]> {
    return Knex(table).select('*').where('id_user', user_id).andWhere('favorite', true).andWhere('is_deleted', false);
  }

  public static async getById(id: number): Promise<TReading | undefined> {
    const [result] = await Knex(table).select('*').where('id', id).andWhere('is_deleted', false);

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

  public static async updatePagesToLast(id: number): Promise<number | undefined> {
    const history = await Knex(TableNames.histories)
      .where('id_reading', id)
      .andWhere('is_deleted', false)
      .orderBy('date', 'desc')
      .first();

    const read_pages = history?.read_pages || 0;

    const result = await Knex(table).update({ read_pages }).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).update({ is_deleted: true }).where('id', id);

    return result || undefined;
  }

  public static async isAdded(id_user: number, id_book: number): Promise<boolean> {
    const [result] = await Knex(table)
      .select('*')
      .where('id_user', id_user)
      .andWhere('id_book', id_book)
      .andWhere('is_deleted', false);

    return !!result;
  }
}
