import { ReadingCategory, ReadingStatus, ReadingType } from '@/enums';
import { TEdition } from './Edition';
import { TUser } from './User';

export type TReading = {
  id: number;
  id_user: number;
  id_edition: number;
  status: ReadingStatus;
  type: ReadingType;
  category: ReadingCategory;
  read_pages?: number;
  rating?: number;
  review?: string;
  favorite?: boolean;
  start_date?: Date;
  finish_date?: Date;
  is_deleted?: boolean;
  user?: TUser;
  edition?: TEdition;
};
