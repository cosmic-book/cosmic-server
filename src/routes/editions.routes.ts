import { EditionsController } from '@/controllers';
import { AuthMiddleware, EditionsMiddleware } from '@/middlewares';
import { Router } from 'express';

const route = Router();

route.use(AuthMiddleware);

route.get('/', EditionsController.findAll);
route.get('/search', EditionsController.search);
route.get('/:id', EditionsController.findById);
route.post('/', EditionsMiddleware, EditionsController.add);
route.put('/:id', EditionsMiddleware, EditionsController.update);
route.delete('/:id', EditionsController.delete);

export default route;
