import { Router } from 'express';
import BooksRoutes from '@/routes/BooksRoutes';
import GendersRoutes from '@/routes/GendersRoutes';
import UsersRoutes from '@/routes/UsersRoutes';

const routes = Router();

routes.use(BooksRoutes);
routes.use(GendersRoutes);
routes.use(UsersRoutes);

export default routes;
