import { TAuthor, TBook, TEdition, TRefBookAuthor } from '@/@types';
import axios from 'axios';
import moment from 'moment';
import { AuthorsService } from './authors.service';
import { BooksService } from './books.service';
import { EditionsService } from './editions.service';
import { RefBookAuthorsService } from './refBookAuthors.service';

type TAuthorOL = {
  key: string;
  name: string;
  fuller_name?: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { type: string; value: string };
};

type TBookOL = {
  key: string;
  title: string;
  author_key: string[];
  author_name: string[];
  first_publish_year: number;
  edition_count: number;
};

type TEditionOL = {
  key: string;
  title: string;
  author: string;
  publish_date?: string;
  number_of_pages?: number;
  isbn_10?: string;
  isbn_13?: string;
  description?: { type: string; value: string } | string;
  languages?: { key: string }[];
  publishers?: string[];
};

export class OpenLibraryService {
  public static async searchAndInsertEdition(term: string): Promise<TEdition[] | undefined> {
    try {
      const encodedTerm = encodeURIComponent(term.trim());

      const bookResponse = await axios.get(
        `https://openlibrary.org/search.json?q=${encodedTerm}&language=por&fields=key,title,author_key,author_name,first_publish_year,edition_count`
      );

      if (!bookResponse.data.docs || bookResponse.data.docs.length === 0) {
        return;
      }

      const editionsInserted: TEdition[] = [];
      const booksToProcess: TBookOL[] = bookResponse.data.docs.slice(0, 10);

      for (const bookResult of booksToProcess) {
        // Book
        const book = await this.searchOrInsertBook(bookResult);

        if (!book || !bookResult.author_key || bookResult.author_key.length === 0) {
          continue;
        }

        const authors: TAuthor[] = [];

        // Authors
        for (const author_key of bookResult.author_key) {
          const author = await this.searchOrInsertAuthor(author_key);

          if (author) {
            authors.push(author);

            const refBookAuthors: TRefBookAuthor = {
              id_book: book.id,
              id_author: author.id
            };

            await RefBookAuthorsService.insert(refBookAuthors);
          }
        }

        if (authors.length === 0) {
          continue;
        }

        book.authors = authors;

        // Editions
        const editionsResponse = await axios.get(
          `https://openlibrary.org/works/${book.ol_book_key}/editions.json?limit=${bookResult.edition_count}`
        );

        if (!editionsResponse.data.entries || editionsResponse.data.entries.length === 0) {
          continue;
        }

        const editionsInPortuguese: TEditionOL[] = editionsResponse.data.entries.filter((edition: TEditionOL) =>
          edition.languages?.some((lang: { key: string }) => lang.key.trim().toLowerCase() === '/languages/por')
        );

        if (editionsInPortuguese.length === 0) {
          continue;
        }

        const editions: TEdition[] = editionsInPortuguese.map((edition: TEditionOL) => ({
          id: 0,
          title: edition.title,
          id_book: book.id,
          publish_date: this.formatDate(edition.publish_date),
          num_pages: edition.number_of_pages ?? 0,
          isbn_13: edition.isbn_13?.[0] ?? '',
          isbn_10: edition.isbn_10?.[0] ?? '',
          description: typeof edition.description === 'string' ? edition.description : edition.description?.value || '',
          language: edition.languages?.[0]?.key ? edition.languages[0].key.toLowerCase().split('/languages/')[1] : '',
          publisher: edition.publishers?.[0].trim().slice(0, 75) || '',
          ol_edition_key: edition.key.split('/books/')[1]
        }));

        const inserted = await this.searchOrinsertEditions(book, editions);

        if (inserted) {
          editionsInserted.push(...inserted);
        }
      }

      return editionsInserted.length > 0 ? editionsInserted : undefined;
    } catch (error) {
      console.error('Erro ao buscar edições:', error);

      return;
    }
  }

  private static async searchOrinsertEditions(book: TBook, editions: TEdition[]): Promise<TEdition[] | undefined> {
    const editionsInserted: TEdition[] = [];

    for (const edition of editions) {
      if (!edition.ol_edition_key) {
        continue;
      }

      const existingEdition = await EditionsService.getByOLKey(edition.ol_edition_key);

      if (existingEdition) {
        editionsInserted.push(existingEdition);
        continue;
      }

      const id = await EditionsService.insert(edition);

      if (!id) {
        console.log('Erro ao adicionar edição:', edition.ol_edition_key);

        continue;
      }

      edition.id = id;
      edition.book = book;

      editionsInserted.push(edition);
    }

    return editionsInserted;
  }

  private static async searchOrInsertBook(bookResult: TBookOL): Promise<TBook | undefined> {
    bookResult.key = bookResult.key.replace('/works/', '');

    let book = await BooksService.getByOLKey(bookResult.key);

    if (book) {
      return book;
    }

    const { title, first_publish_year, key } = bookResult;

    const newBook: TBook = {
      id: 0,
      title,
      first_publish_year,
      ol_book_key: key
    };

    const id = await BooksService.insert(newBook);

    if (!id) {
      throw new Error('Erro ao adicionar livro');
    }

    newBook.id = id;

    return newBook;
  }

  private static async searchOrInsertAuthor(author_key: string): Promise<TAuthor | undefined> {
    try {
      const author = await AuthorsService.getByOLKey(author_key);

      if (author) {
        return author;
      }

      const authorResponse = await axios.get(`https://openlibrary.org/authors/${author_key}.json`);

      const authorData: TAuthorOL = authorResponse.data;

      if (!authorData) {
        return;
      }

      const { name, fuller_name, birth_date, death_date, bio } = authorData;

      let authorBio = '';

      if (bio) {
        authorBio = bio instanceof Object ? bio.value : bio;
      }

      const newAuthor: TAuthor = {
        id: 0,
        name: name,
        full_name: fuller_name,
        birth_date: this.formatDate(birth_date),
        death_date: this.formatDate(death_date),
        bio: authorBio,
        ol_author_key: author_key
      };

      const id = await AuthorsService.insert(newAuthor);

      if (!id) {
        throw new Error('Erro ao adicionar autor');
      }

      newAuthor.id = id;

      return newAuthor;
    } catch (error) {
      console.error('Erro ao buscar autor:', error);

      return;
    }
  }

  private static formatDate(date?: string): string | undefined {
    if (!date) {
      return;
    }

    const mDate = moment(date);

    return mDate.isValid() ? mDate.format('YYYY-MM-DD') : undefined;
  }
}
