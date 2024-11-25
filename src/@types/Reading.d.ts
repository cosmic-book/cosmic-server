import { ReadingCategory, ReadingStatus, ReadingType } from '@/enums';
import { TBook } from './Book';

export type TReading = {
  id: number;
  id_user: number;
  id_book: number;
  status: ReadingStatus;
  type: ReadingType;
  category: ReadingCategory;
  read_pages?: number;
  rating?: number;
  review?: string;
  favorite?: boolean;
  start_date?: Date;
  finish_date?: Date;
  book?: TBook;
};
