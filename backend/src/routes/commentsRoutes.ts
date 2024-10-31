import { Router } from 'express';
import * as commentsController from '../controllers/comments/commentsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router({ mergeParams: true }); // includes posts/:id in the req.params

router.post('/', authMiddleware, commentsController.createComment);
router.get('/', commentsController.getCommentsByPostId);
router.put('/:commentId', authMiddleware, commentsController.updateComment);

export default router;
