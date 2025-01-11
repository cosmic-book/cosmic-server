import { TGender } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.genders;

export class GendersService {
  public static async getAll(): Promise<TGender[]> {
    return Knex(table).select('*').where('is_deleted', false);
  }

  public static async getById(id: number): Promise<TGender | undefined> {
    const [result] = await Knex(table).select('*').where('id', id).andWhere('is_deleted', false);

    return result || undefined;
  }

  public static async getByName(name: string): Promise<TGender | undefined> {
    const [result] = await Knex(table).select('*').where('name', '=', name.trim()).andWhere('is_deleted', false);

    return result || undefined;
  }

  public static async insert(gender: TGender): Promise<number | undefined> {
    const [result] = await Knex(table).insert(gender);

    return result || undefined;
  }

  public static async update(id: number, gender: TGender): Promise<number | undefined> {
    const result = await Knex(table).update(gender).where('id', id).andWhere('is_deleted', false);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).update({ is_deleted: true }).where('id', id);

    return result || undefined;
  }
}
