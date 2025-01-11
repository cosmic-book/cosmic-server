import { TReading } from './Reading';

export type THistory = {
  id: number;
  id_user: number;
  id_reading: number;
  date: Date;
  read_pages: number;
  comment?: string;
  is_deleted?: boolean;
  reading?: TReading;
};
