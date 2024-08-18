import { Router } from 'express';
import BooksRoutes from '@/routes/BooksRoutes';

const routes = Router();

routes.use(BooksRoutes);

export default routes;
