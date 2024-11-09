import { Knex } from 'knex';
import { TableNames } from '../TableNames';
import { Book, Gender } from '@/@types';
import { readFile } from 'fs/promises';
import { BooksService, GendersService, RefBookGendersService } from '../services';
import { join } from 'path';

export type RefBookGender = {
  id_book: number;
  id_gender: number;
};

export async function up(knex: Knex): Promise<void> {
  const filePath = join(__dirname, '..', '..', 'json', 'data.json');
  const data: any[] = JSON.parse(await readFile(filePath, 'utf8'));

  for (const item of data) {
    const book: Book = {
      id: 0,
      title: item.title,
      author: item.author,
      year: item.year,
      pages: item.pages,
      isbn_13: item.isbn_13,
      isbn_10: item.isbn_10,
      description: item.description?.toString() || '',
      language: item.language,
      publisher: item.publisher
    };

    if (book.isbn_13 && book.isbn_10 && (book.isbn_13.length < 13 || book.isbn_10.length < 10)) {
      continue;
    }

    const existsBook = await BooksService.getByISBN(book);

    if (existsBook) continue;

    try {
      const id = await BooksService.insert(book);

      if (id) book.id = id;
    } catch (error) {
      continue;
    }

    // Genders

    const bookGenders: string[] = item.gender.split(' / ');

    for (const genderName of bookGenders) {
      const existsGender = await GendersService.getByName(genderName);

      const gender: Gender = {
        id: existsGender?.id || 0,
        name: genderName.trim()
      };

      try {
        if (gender.id === 0) {
          const id = await GendersService.insert(gender);

          if (id) gender.id = id;
        }

        const refBookGender: RefBookGender = {
          id_book: book.id,
          id_gender: gender.id
        };

        await RefBookGendersService.insert(refBookGender);
      } catch (error) {
        continue;
      }
    }
  }

  console.log('Migration Completed');
}

export async function down(knex: Knex): Promise<void> {
  knex(TableNames.refBookGenders).del();
  knex(TableNames.genders).del();
  knex(TableNames.books).del();
}
