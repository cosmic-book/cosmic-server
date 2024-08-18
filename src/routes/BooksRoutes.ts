import { Router } from 'express';
import { BooksController } from '@/controllers';
import { BooksMiddleware } from '@/middlewares';

const usersRoutes = Router();

usersRoutes.get('/books', BooksController.findAll);
usersRoutes.get('/books/:id', BooksController.findById);
usersRoutes.post('/books', BooksMiddleware, BooksController.add);
usersRoutes.put('/books/:id', BooksMiddleware, BooksController.update);
usersRoutes.delete('/books/:id', BooksController.delete);

export default usersRoutes;
