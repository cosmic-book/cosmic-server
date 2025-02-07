import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.users);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.users, (table) => {
      table.increments('id').unsigned().primary();
      table.string('name', 150).notNullable();
      table.string('username', 30).notNullable();
      table.string('email', 100).notNullable();
      table.date('birthday').notNullable();
      table.string('gender', 1).notNullable();
      table.text('image');
      table.integer('profile');
      table.string('password', 64).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.users);
}
