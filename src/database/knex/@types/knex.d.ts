import { TBook, TGender, THistory, TReading, TRefBookGender, TRefUserGender, TUser } from '@/@types';

declare module 'knex/types/tables' {
  interface Tables {
    books: TBook;
    genders: TGender;
    histories: THistory;
    readings: TReading;
    refBookGenders: TRefBookGender;
    refUserGenders: TRefUserGender;
    users: TUser;
  }
}
