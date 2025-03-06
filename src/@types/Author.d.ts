import { TBook } from './Book';

export type TAuthor = {
  id: number;
  name: string;
  full_name?: string;
  birth_date?: string;
  death_date?: string;
  bio?: string;
  ol_author_key?: string;
  photo?: string;
  is_deleted?: boolean;
  total_books?: number;
  books?: TBook[];
};
