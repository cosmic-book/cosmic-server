import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.editions, (table) => {
    table.dropForeign('id_author', 'fk_idAuthorEdition');
    table.dropColumn('id_author');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.editions, (table) => {
    table.integer('id_author').unsigned().notNullable(),
      table.foreign('id_author', 'fk_idAuthorEdition').references('id').inTable(TableNames.authors).onDelete('CASCADE');
  });
}
