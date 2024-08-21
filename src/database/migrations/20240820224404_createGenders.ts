import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.genders);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.genders, (table) => {
      table.increments('id').unsigned().primary(), table.string('name', 50).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.genders);
}
