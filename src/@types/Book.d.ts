import { TAuthor } from './Author';
import { TEdition } from './Edition';

export type TBook = {
  id: number;
  title: string;
  first_publish_year: number;
  ol_book_key?: string;
  cover?: string;
  is_deleted?: boolean;
  total_editions?: number;
  authors?: TAuthor[];
  editions?: TEdition[];
};
