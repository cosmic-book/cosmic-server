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

  public static async getByName(name: string): Promise<Gender | undefined> {
    const [result] = await Knex(table).select('*').where('name', '=', name.trim());

    return result || undefined;
  }

  public static async insert(gender: Gender): Promise<number | undefined> {
    const [result] = await Knex(table).insert(gender);

    return result || undefined;
  }

  public static async update(id: number, gender: Gender): Promise<number | undefined> {
    const result = await Knex(table).update(gender).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id', id);

    return result || undefined;
  }
}
