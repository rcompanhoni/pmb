import { Router } from 'express';
import * as commentsController from '../controllers/comments/commentsController';

const router = Router({ mergeParams: true }); // includes posts/:id

router.get('/', commentsController.getCommentsByPostId);

export default router;
