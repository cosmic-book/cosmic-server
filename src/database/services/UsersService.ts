import { User } from '@/@types';
import { TableNames } from '../TableNames';
import { Knex } from '../knex';

const table = TableNames.users;

export default class UsersService {
  public static async getAll(): Promise<User[]> {
    return Knex(table).select('*');
  }

  public static async getById(id: number): Promise<User | undefined> {
    const [result] = await Knex(table).select('*').where('id', id).limit(1);

    return result || undefined;
  }

  public static async getByUsername(username: string): Promise<User | undefined> {
    const [result] = await Knex(table).select('*').where('username', username).limit(1);

    return result || undefined;
  }

  public static async getByEmail(email: string): Promise<User | undefined> {
    const [result] = await Knex(table).select('*').where('email', email).limit(1);

    return result || undefined;
  }

  public static async insert(user: User): Promise<number | undefined> {
    const [result] = await Knex(table).insert(user);

    return result || undefined;
  }

  public static async update(id: number, user: User): Promise<number | undefined> {
    const result = await Knex(table).update(user).where('id', id);

    return result || undefined;
  }

  public static async delete(id: number): Promise<number | undefined> {
    const result = await Knex(table).delete().where('id', id);

    return result || undefined;
  }
}
