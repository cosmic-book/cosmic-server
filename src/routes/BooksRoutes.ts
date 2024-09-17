import { Router } from 'express';
import { BooksController } from '@/controllers';
import { BooksMiddleware } from '@/middlewares';

const booksRoutes = Router();

booksRoutes.get('/books', BooksController.findAll);
booksRoutes.get('/books/search/:term', BooksController.search);
booksRoutes.get('/books/:id', BooksController.findById);
booksRoutes.post('/books', BooksMiddleware, BooksController.add);
booksRoutes.post('/books/all', BooksController.addAll);
booksRoutes.put('/books/:id', BooksMiddleware, BooksController.update);
booksRoutes.delete('/books/:id', BooksController.delete);

export default booksRoutes;
