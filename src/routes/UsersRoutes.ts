import { UsersController } from '@/controllers';
import { AuthMiddleware, PasswordMiddleware, UsersMiddleware } from '@/middlewares';
import { Router } from 'express';

const route = Router();

route.use(AuthMiddleware);

route.get('/', UsersController.findAll);
route.get('/:id', UsersController.findById);
route.post('/', UsersMiddleware, UsersController.add);
route.put('/:id', UsersMiddleware, UsersController.update);
route.put('/password/:id', PasswordMiddleware, UsersController.changePassword);
route.delete('/:id', UsersController.delete);

export default route;
