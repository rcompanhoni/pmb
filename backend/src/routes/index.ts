import { Router } from 'express';
import postRoutes from './postRoutes';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Base route' });
});

router.use('/posts', postRoutes);

export default router;
