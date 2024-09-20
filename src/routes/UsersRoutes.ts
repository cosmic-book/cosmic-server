import { UsersController } from '@/controllers';
import { UsersMiddleware } from '@/middlewares';
import { Router } from 'express';

const route = Router();

route.get('/', UsersController.findAll);
route.get('/:id', UsersController.findById);
route.post('/login', UsersController.login);
route.post('/', UsersMiddleware, UsersController.add);
route.put('/:id', UsersMiddleware, UsersController.update);
route.delete('/:id', UsersController.delete);

export default route;
