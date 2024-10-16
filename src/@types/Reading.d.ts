import { ItemType, OwnershipStatus, ReadingStatus } from '@/enums';

type Reading = {
  id: number;
  id_user: number;
  id_book: number;
  status: ReadingStatus;
  type: ItemType;
  ownership: OwnershipStatus;
  readPages?: number;
  rating?: number;
  review?: string;
  like?: boolean;
};

export default Reading;
