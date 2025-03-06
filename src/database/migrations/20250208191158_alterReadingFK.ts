import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable(TableNames.readings, (table) => {
      table.dropForeign(['id_book'], 'fk_readings_idBook');

      table.renameColumn('id_book', 'id_edition');
    })
    .then(() => {
      return knex.schema.alterTable(TableNames.readings, (table) => {
        table
          .foreign('id_edition', 'fk_readings_idEdition')
          .references('id')
          .inTable(TableNames.editions)
          .onDelete('CASCADE');
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable(TableNames.readings, (table) => {
      table.dropForeign(['id_edition'], 'fk_readings_idEdition');

      table.renameColumn('id_edition', 'id_book');
    })
    .then(() => {
      return knex.schema.alterTable(TableNames.readings, (table) => {
        table.foreign('id_book', 'fk_readings_idBook').references('id').inTable(TableNames.books).onDelete('CASCADE');
      });
    });
}
