import { ProfileController } from '@/controllers';
import { AuthMiddleware } from '@/middlewares';
import { Router } from 'express';

const route = Router();

route.use(AuthMiddleware);

route.get('/:id', ProfileController.findInfosByUser);

export default route;
