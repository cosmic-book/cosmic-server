import { TEdition } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.editions;

export class EditionsService {
  public static async getAll(limit: string = '300'): Promise<TEdition[]> {
    return Knex(table).select('*').where('is_deleted', false).limit(parseInt(limit));
  }

  public static async getById(id: number): Promise<TEdition | undefined> {
    const [result] = await Knex(table).select('*').where('id', id).andWhere('is_deleted', false);

    return result || undefined;
  }

  public static async getByISBN(edition: TEdition): Promise<TEdition | undefined> {
    const [result] = await Knex(table)
      .select('*')
      .where('isbn_13', edition.isbn_13)
      .orWhere('isbn_10', edition.isbn_10)
      .andWhere('is_deleted', false);

    return result || undefined;
  }

  public static async search(term?: string): Promise<Partial<TEdition>[]> {
    const result = await Knex(table).select('*').where('title', 'like', `%${term}%`).andWhere('is_deleted', false);

    return result;
  }

  public static async insert(edition: TEdition): Promise<number | undefined> {
    const [result] = await Knex(table).insert(edition);

    return result || undefined;
  }

  public static async update(id: number, edition: TEdition): Promise<number | undefined> {
    const result = await Knex(table).update(edition).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).update({ is_deleted: true }).where('id', id);

    return result || undefined;
  }
}
