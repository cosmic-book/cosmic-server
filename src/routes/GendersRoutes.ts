import { Router } from 'express';
import { GendersController } from '@/controllers';
import { GendersMiddleware } from '@/middlewares';

const gendersRoutes = Router();

gendersRoutes.get('/genders', GendersController.findAll);
gendersRoutes.get('/genders/:id', GendersController.findById);
gendersRoutes.post('/genders', GendersMiddleware, GendersController.add);
gendersRoutes.put('/genders/:id', GendersMiddleware, GendersController.update);
gendersRoutes.delete('/genders/:id', GendersController.delete);

export default gendersRoutes;
