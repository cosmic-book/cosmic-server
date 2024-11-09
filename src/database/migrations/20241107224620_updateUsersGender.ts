import { Knex } from 'knex';
import { TableNames } from '../TableNames';
import { Gender } from '../../enums';

export async function up(knex: Knex): Promise<void> {
  await knex(TableNames.users).where('gender', 'like', 'M').update({ gender: Gender.MASCULINE });
  await knex(TableNames.users).where('gender', 'like', 'F').update({ gender: Gender.FEMININE });
  await knex(TableNames.users).where('gender', 'like', 'O').update({ gender: Gender.OTHER });
}

export async function down(knex: Knex): Promise<void> {}
