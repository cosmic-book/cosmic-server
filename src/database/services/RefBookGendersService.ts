import { RefBookGender } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.refBookGenders;

export default class RefBookGendersService {
  public static async getAll(): Promise<RefBookGender[]> {
    return Knex(table).select('*');
  }

  public static async getByBook(book_id: number): Promise<RefBookGender[]> {
    const [result] = await Knex(table).select('*').where('book_id', book_id);

    return result || undefined;
  }

  public static async getByGender(gender_id: number): Promise<RefBookGender[]> {
    const [result] = await Knex(table).select('*').where('gender_id', gender_id);

    return result || undefined;
  }

  public static async insert(refBookGender: RefBookGender): Promise<number | undefined> {
    const [result] = await Knex(table).insert(refBookGender);

    return result || undefined;
  }

  public static async deleteByBook(book_id: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('book_id', book_id);

    return result || undefined;
  }

  public static async deleteByGender(gender_id: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('gender_id', gender_id);

    return result || undefined;
  }
}
