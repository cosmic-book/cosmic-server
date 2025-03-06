import { TAuthor } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.authors;

export class AuthorsService {
  public static async getAll(limit: string = '300'): Promise<TAuthor[]> {
    return Knex(table).select('*').where('is_deleted', false).limit(parseInt(limit));
  }

  public static async getById(id: number): Promise<TAuthor | undefined> {
    const [result] = await Knex(table).select('*').where('id', id).andWhere('is_deleted', false);

    return result || undefined;
  }

  public static async getByOLKey(key: string): Promise<TAuthor | undefined> {
    const [result] = await Knex(table).select('*').where('ol_author_key', key).andWhere('is_deleted', false);

    return result || undefined;
  }

  public static async search(term?: string): Promise<Partial<TAuthor>[]> {
    const result = await Knex(table).select('*').where('name', 'like', `%${term}%`).andWhere('is_deleted', false);

    return result;
  }

  public static async insert(author: TAuthor): Promise<number | undefined> {
    const [result] = await Knex(table).insert(author);

    return result || undefined;
  }

  public static async update(id: number, author: TAuthor): Promise<number | undefined> {
    const result = await Knex(table).update(author).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).update({ is_deleted: true }).where('id', id);

    return result || undefined;
  }
}
