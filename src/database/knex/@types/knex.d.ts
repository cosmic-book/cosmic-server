import { Book, Gender, RefBookGender, RefUserGender, User } from '@/@types';

declare module 'knex/types/tables' {
  interface Tables {
    books: Book;
    genders: Gender;
    users: User;
    refBookGenders: RefBookGender;
    refUserGenders: RefUserGender;
  }
}
