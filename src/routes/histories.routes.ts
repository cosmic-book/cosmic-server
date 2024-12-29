import { HistoriesController } from '@/controllers';
import { AuthMiddleware, HistoriesMiddleware } from '@/middlewares';
import { Router } from 'express';

const route = Router();

route.use(AuthMiddleware);

route.get('/', HistoriesController.findAll);
route.get('/reading/:id', HistoriesController.findByReading);
route.get('/:id', HistoriesController.findById);
route.post('/', HistoriesMiddleware, HistoriesController.add);
route.put('/:id', HistoriesMiddleware, HistoriesController.update);
route.delete('/:id', HistoriesController.delete);

export default route;
