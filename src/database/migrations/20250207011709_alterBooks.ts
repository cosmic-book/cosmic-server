import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.books);

  if (hasTable) {
    return knex.schema.alterTable(TableNames.books, (table) => {
      // Delete old columns
      table.dropColumn('author');
      table.dropColumn('year');
      table.dropColumn('pages');
      table.dropColumn('isbn_13');
      table.dropColumn('isbn_10');
      table.dropColumn('language');
      table.dropColumn('description');
      table.dropColumn('publisher');

      // Create new columns
      table.string('first_publish_year', 4);
      table.string('ol_book_key', 15);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.books);

  if (hasTable) {
    return knex.schema.alterTable(TableNames.books, (table) => {
      // Delete new columns
      table.dropColumn('first_publish_year');
      table.dropColumn('ol_book_key');

      // Re-create old columns
      table.string('author', 200).notNullable();
      table.integer('year');
      table.integer('pages').notNullable();
      table.string('isbn_13', 13);
      table.string('isbn_10', 10);
      table.string('language', 30);
      table.text('description').notNullable();
      table.string('publisher', 75).notNullable();
    });
  }
}
