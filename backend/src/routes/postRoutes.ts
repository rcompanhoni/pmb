import { Router } from 'express';
import * as postController from '../controllers/posts/postsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.put('/:id', authMiddleware, postController.updatePost);

export default router;
