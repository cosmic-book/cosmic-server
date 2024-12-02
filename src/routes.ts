import { Router } from 'express';
import AuthRoutes from '@/routes/AuthRoutes';

import BooksRoutes from '@/routes/BooksRoutes';
import GendersRoutes from '@/routes/GendersRoutes';
import HistoriesRoutes from '@/routes/HistoriesRoutes';
import ProfileRoutes from '@/routes/ProfileRoutes';
import ReadingsRoutes from '@/routes/ReadingsRoutes';
import UsersRoutes from '@/routes/UsersRoutes';

const routes = Router();

routes.use('/auth', AuthRoutes);
routes.use('/books', BooksRoutes);
routes.use('/genders', GendersRoutes);
routes.use('/histories', HistoriesRoutes);
routes.use('/profile', ProfileRoutes);
routes.use('/readings', ReadingsRoutes);
routes.use('/users', UsersRoutes);

export default routes;
