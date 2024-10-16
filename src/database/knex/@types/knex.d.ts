import { Book, Reading, Gender, RefBookGender, RefUserGender, User } from '@/@types';

declare module 'knex/types/tables' {
  interface Tables {
    books: Book;
    readings: Reading;
    genders: Gender;
    refBookGenders: RefBookGender;
    refUserGenders: RefUserGender;
    users: User;
  }
}
