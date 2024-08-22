type Book = {
  id: number;
  title: string;
  author?: string;
  year?: number;
  pages: number;
  isbn_13?: string;
  isbn_10?: string;
  description: string;
  language: string;
  publisher: string;
};

export default Book;
