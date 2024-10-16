import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.readings);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.readings, (table) => {
      table.increments('id').unsigned().primary(),
        table.integer('id_user').unsigned().notNullable(),
        table.integer('id_book').unsigned().notNullable(),
        table.integer('status').notNullable().defaultTo(0),
        table.integer('type').notNullable().defaultTo(0),
        table.integer('ownership').notNullable().defaultTo(0),
        table.integer('read_pages'),
        table.integer('rating'),
        table.text('review'),
        table.boolean('like'),
        table.foreign('id_user', 'fk_idUserReading').references('id').inTable(TableNames.users).onDelete('CASCADE'),
        table.foreign('id_book', 'fk_idBookReading').references('id').inTable(TableNames.books).onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.readings);
}
