import { RefBookGender } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.refBookGenders;

export default class RefBookGendersService {
  public static async getAll(): Promise<RefBookGender[]> {
    return Knex(table).select('*');
  }

  public static async getByBook(id_book: number): Promise<RefBookGender[]> {
    const result = await Knex(table).select('*').where('id_book', id_book);

    return result || undefined;
  }

  public static async getByGender(id_gender: number): Promise<RefBookGender[]> {
    const result = await Knex(table).select('*').where('id_gender', id_gender);

    return result || undefined;
  }

  public static async insert(refBookGender: RefBookGender): Promise<number | undefined> {
    const [result] = await Knex(table).insert(refBookGender);

    return result || undefined;
  }

  public static async deleteByBook(id_book: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id_book', id_book);

    return result || undefined;
  }

  public static async deleteByGender(id_gender: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id_gender', id_gender);

    return result || undefined;
  }
}
