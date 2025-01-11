export type TBook = {
  id: number;
  title: string;
  author?: string;
  year?: number;
  pages: number;
  isbn_13?: string;
  isbn_10?: string;
  description: string;
  language: string;
  genders?: Gender[];
  publisher: string;
  cover?: string;
  is_deleted?: boolean;
};
