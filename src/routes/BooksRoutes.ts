import { BooksController } from '@/controllers';
import { BooksMiddleware } from '@/middlewares';
import { Router } from 'express';

const route = Router();

route.get('/', BooksController.findAll);
route.get('/search', BooksController.search);
route.get('/:id', BooksController.findById);
route.post('/', BooksMiddleware, BooksController.add);
route.post('/all', BooksController.addAll);
route.put('/:id', BooksMiddleware, BooksController.update);
route.delete('/:id', BooksController.delete);

export default route;
