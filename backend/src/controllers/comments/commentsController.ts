import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as commentsRepository from '../../repositories/comments/commentsRepository';

export const getCommentsByPostId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // post ID from the params
    const { id: postId } = req.params;
    if (!postId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'The Post id is missing' });
      return;
    }

    // fetch comments
    const comments = await commentsRepository.getCommentsByPostId(postId);
    res.status(StatusCodes.OK).json(comments);
  } catch (error) {
    console.error('Error fetching comments for a Post', { error });

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while retrieving comments.',
    });
  }
};
