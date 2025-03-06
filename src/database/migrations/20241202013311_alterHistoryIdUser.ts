import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.histories, (table) => {
    table.integer('id_user').unsigned().notNullable();
    table.foreign('id_user', 'fk_histories_idUser').references('id').inTable(TableNames.users).onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.histories, (table) => {
    table.dropColumn('id_user');
    table.dropForeign('fk_histories_idUser');
  });
}
