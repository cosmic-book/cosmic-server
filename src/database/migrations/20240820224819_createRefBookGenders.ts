import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.refBookGenders);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.refBookGenders, (table) => {
      table.integer('id_book').unsigned().notNullable();
      table.integer('id_gender').unsigned().notNullable();
      table
        .foreign('id_book', 'fk_refBookGenders_idBook')
        .references('id')
        .inTable(TableNames.books)
        .onDelete('CASCADE');
      table
        .foreign('id_gender', 'fk_refBookGenders_idGender')
        .references('id')
        .inTable(TableNames.genders)
        .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.refBookGenders);
}
