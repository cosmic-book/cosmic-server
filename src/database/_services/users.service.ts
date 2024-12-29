import { TUser } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.users;

export class UsersService {
  public static async getAll(): Promise<TUser[]> {
    return Knex(table).select('*');
  }

  public static async getById(id: number): Promise<TUser | undefined> {
    const [result] = await Knex(table).select('*').where('id', id).limit(1);

    return result || undefined;
  }

  public static async getByUsername(username: string): Promise<TUser | undefined> {
    const [result] = await Knex(table).select('*').where('username', username).limit(1);

    return result || undefined;
  }

  public static async getByEmail(email: string): Promise<TUser | undefined> {
    const [result] = await Knex(table).select('*').where('email', email).limit(1);

    return result || undefined;
  }

  public static async insert(user: TUser): Promise<number | undefined> {
    const [result] = await Knex(table).insert(user);

    return result || undefined;
  }

  public static async update(id: number, user: TUser): Promise<number | undefined> {
    const result = await Knex(table).update(user).where('id', id);

    return result || undefined;
  }

  public static async updatePassword(id: number, newPassword: string): Promise<number | undefined> {
    const result = await Knex(table).where('id', id).update({ password: newPassword });

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id', id);

    return result || undefined;
  }
}
