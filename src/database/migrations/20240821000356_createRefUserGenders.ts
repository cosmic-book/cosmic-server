import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.refUserGenders);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.refUserGenders, (table) => {
      table.integer('id_user').unsigned().notNullable(),
        table.integer('id_gender').unsigned().notNullable(),
        table
          .foreign('id_user', 'fk_idUser')
          .references('id')
          .inTable(TableNames.users)
          .onDelete('CASCADE'),
        table
          .foreign('id_gender', 'fk_idUserGender')
          .references('id')
          .inTable(TableNames.genders)
          .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.refUserGenders);
}
