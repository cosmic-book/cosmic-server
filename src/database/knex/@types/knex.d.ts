import { TAuthor, TBook, TEdition, THistory, TReading, TRefBookAuthor, TUser } from '@/@types';

declare module 'knex/types/tables' {
  interface Tables {
    authors: TAuthor;
    books: TBook;
    editions: TEdition;
    histories: THistory;
    readings: TReading;
    refBookAuthors: TRefBookAuthor;
    users: TUser;
  }
}
