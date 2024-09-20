import { Router } from 'express';
import BooksRoutes from '@/routes/BooksRoutes';
import GendersRoutes from '@/routes/GendersRoutes';
import UsersRoutes from '@/routes/UsersRoutes';

const routes = Router();

routes.use('/books', BooksRoutes);
routes.use('/genders', GendersRoutes);
routes.use('/users', UsersRoutes);

export default routes;
