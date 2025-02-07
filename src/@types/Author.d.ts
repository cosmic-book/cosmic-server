import { TBook } from './Book';

export type TAuthor = {
  id: number;
  name: string;
  birth_date: Date;
  death_date?: Date;
  bio?: string;
  ol_author_key?: string;
  photo?: string;
  is_deleted?: boolean;
  total_books?: number;
  books?: TBook[];
};
