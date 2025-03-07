import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.refBookAuthors);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.refBookAuthors, (table) => {
      table.integer('id_book').unsigned().notNullable();
      table.integer('id_author').unsigned().notNullable();

      table
        .foreign('id_book', 'fk_refBookAuthor_idBook')
        .references('id')
        .inTable(TableNames.books)
        .onDelete('CASCADE');
      table
        .foreign('id_author', 'fk_refBookAuthor_idAuthor')
        .references('id')
        .inTable(TableNames.authors)
        .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.refBookAuthors);
}
