import { Router } from 'express';
import { UsersController } from '@/controllers';
import { UsersMiddleware } from '@/middlewares';

const usersRoutes = Router();

usersRoutes.get('/users', UsersController.findAll);
usersRoutes.get('/users/:id', UsersController.findById);
usersRoutes.post('/users', UsersMiddleware, UsersController.add);
usersRoutes.put('/users/:id', UsersMiddleware, UsersController.update);
usersRoutes.delete('/users/:id', UsersController.delete);

export default usersRoutes;
