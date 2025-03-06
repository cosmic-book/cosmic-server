import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.books);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.books, (table) => {
      table.increments('id').unsigned().primary();
      table.string('title', 150).notNullable();
      table.string('author', 200);
      table.integer('year');
      table.integer('pages').notNullable();
      table.string('isbn_13', 13);
      table.string('isbn_10', 10);
      table.string('description', 350).notNullable();
      table.string('language', 30).notNullable();
      table.string('publisher', 75).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.books);
}
