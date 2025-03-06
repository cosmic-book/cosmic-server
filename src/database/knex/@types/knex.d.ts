import {
  TAuthor,
  TBook,
  TEdition,
  TGender,
  THistory,
  TReading,
  TRefBookAuthor,
  TRefBookGender,
  TRefUserGender,
  TUser
} from '@/@types';

declare module 'knex/types/tables' {
  interface Tables {
    authors: TAuthor;
    books: TBook;
    editions: TEdition;
    genders: TGender;
    histories: THistory;
    readings: TReading;
    refBookAuthors: TRefBookAuthor;
    refBookGenders: TRefBookGender;
    refUserGenders: TRefUserGender;
    users: TUser;
  }
}
