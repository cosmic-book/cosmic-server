import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.books);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.books, (table) => {
      table.increments('id').unsigned().primary();
      table.string('title', 150).notNullable();
      table.string('first_publish_year', 4);
      table.string('ol_book_key', 15);
      table.boolean('is_deleted').notNullable().defaultTo(false);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.books);
}
