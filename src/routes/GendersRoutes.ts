import { GendersController } from '@/controllers';
import { GendersMiddleware } from '@/middlewares';
import { Router } from 'express';

const route = Router();

route.get('/', GendersController.findAll);
route.get('/names', GendersController.getGendersName);
route.get('/:id', GendersController.findById);
route.post('/', GendersMiddleware, GendersController.add);
route.put('/:id', GendersMiddleware, GendersController.update);
route.delete('/:id', GendersController.delete);

export default route;
