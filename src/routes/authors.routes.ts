import { AuthorsController } from '@/controllers';
import { AuthMiddleware, AuthorsMiddleware } from '@/middlewares';
import { Router } from 'express';

const route = Router();

route.use(AuthMiddleware);

route.get('/', AuthorsController.findAll);
route.get('/search', AuthorsController.search);
route.get('/:id', AuthorsController.findById);
route.post('/', AuthorsMiddleware, AuthorsController.add);
route.put('/:id', AuthorsMiddleware, AuthorsController.update);
route.delete('/:id', AuthorsController.delete);

export default route;
