import { Router } from 'express';
import BooksRoutes from '@/routes/BooksRoutes';
import GendersRoutes from '@/routes/GendersRoutes';

const routes = Router();

routes.use(BooksRoutes);

export default routes;
