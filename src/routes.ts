import { Router } from 'express';
import BooksRoutes from '@/routes/BooksRoutes';
import GendersRoutes from '@/routes/GendersRoutes';
import ReadingsRoutes from '@/routes/ReadingsRoutes';
import UsersRoutes from '@/routes/UsersRoutes';

const routes = Router();

routes.use('/books', BooksRoutes);
routes.use('/genders', GendersRoutes);
routes.use('/readings', ReadingsRoutes);
routes.use('/users', UsersRoutes);

export default routes;
