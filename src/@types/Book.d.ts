type Book = {
  id: number;
  title: string;
  author?: string;
  year?: number;
  pages: number;
  isbn_10?: string;
  isbn_13?: string;
  description: string;
  language: string;
  publisher: string;
};

export default Book;
