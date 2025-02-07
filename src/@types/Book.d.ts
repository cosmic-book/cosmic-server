import { TAuthor } from './Author';
import { TEdition } from './Edition';

export type TBook = {
  id: number;
  title: string;
  release_date: Date;
  language: string;
  ol_book_key?: string;
  cover?: string;
  is_deleted?: boolean;
  total_editions?: number;
  authors?: TAuthor[];
  editions?: TEdition[];
};
