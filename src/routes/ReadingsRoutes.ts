import { ReadingsController } from '@/controllers';
import { ReadingsMiddleware } from '@/middlewares';
import { Router } from 'express';

const route = Router();

route.get('/', ReadingsController.findAll);
route.get('/:id', ReadingsController.findById);
route.post('/', ReadingsMiddleware, ReadingsController.add);
route.put('/:id', ReadingsMiddleware, ReadingsController.update);
route.delete('/:id', ReadingsController.delete);

export default route;
