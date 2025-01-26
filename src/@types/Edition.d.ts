export type TEdition = {
  id: number;
  title: string;
  id_book: number;
  id_author: number;
  publish_date?: Date;
  num_pages: number;
  isbn_13?: string;
  isbn_10?: string;
  description?: string;
  language: string;
  publisher?: string;
  ol_edition_key?: string;
  cover?: string;
  is_deleted?: boolean;
  book?: TBook;
  author?: TAuthor;
};
