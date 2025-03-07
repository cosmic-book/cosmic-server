import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.editions);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.editions, (table) => {
      table.increments('id').unsigned().primary();
      table.string('title', 150).notNullable();
      table.integer('id_book').unsigned().notNullable();
      table.date('publish_date');
      table.integer('num_pages').notNullable();
      table.string('isbn_13', 13);
      table.string('isbn_10', 10);
      table.text('description');
      table.string('language', 3).notNullable();
      table.string('publisher', 75);
      table.string('ol_edition_key', 15);
      table.boolean('is_deleted').notNullable().defaultTo(false);

      table.foreign('id_book', 'fk_editions_idBook').references('id').inTable(TableNames.books).onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.editions);
}
