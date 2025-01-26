import { Router } from 'express';

import AuthRoutes from '@/routes/auth.routes';
import AuthorsRoutes from '@/routes/authors.routes';
import BooksRoutes from '@/routes/books.routes';
import GendersRoutes from '@/routes/genders.routes';
import HistoriesRoutes from '@/routes/histories.routes';
import ProfileRoutes from '@/routes/profile.routes';
import ReadingsRoutes from '@/routes/readings.routes';
import UsersRoutes from '@/routes/users.routes';

const routes = Router();

routes.use('/auth', AuthRoutes);
routes.use('/authors', AuthorsRoutes);
routes.use('/books', BooksRoutes);
routes.use('/genders', GendersRoutes);
routes.use('/histories', HistoriesRoutes);
routes.use('/profile', ProfileRoutes);
routes.use('/readings', ReadingsRoutes);
routes.use('/users', UsersRoutes);

export default routes;
