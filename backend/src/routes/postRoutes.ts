import { Router } from 'express';
import * as postController from '../controllers/postController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);

export default router;
