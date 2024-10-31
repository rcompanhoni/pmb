import { Router } from 'express';
import postsRoutes from './postsRoutes';
import commentsRoutes from './commentsRoutes';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Base route' });
});

router.use('/posts', postsRoutes);
router.use('/posts/:id/comments', commentsRoutes);

export default router;
