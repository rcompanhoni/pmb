import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as commentsRepository from '../../repositories/comments/commentsRepository';
import { commentSchema } from '../../repositories/comments/types';
import { ZodError } from 'zod';

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

export const createComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id: postId } = req.params;
    if (!postId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'The Post id is missing' });
      return;
    }

    // check for the JWT token
    const token = req.body.jwtToken;
    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token is missing' });
      return;
    }

    // validate and transform the body data to the proper expected DB model
    const validatedData = commentSchema.parse({
      ...req.body,
      postId,
      userId: req.body.userId, // Assuming the user ID is added by authMiddleware
    });

    // persist
    const newComment = await commentsRepository.createComment(
      validatedData,
      token,
    );
    res.status(StatusCodes.CREATED).json(newComment);
  } catch (error) {
    console.error('Error creating comment', { error });

    if (error instanceof ZodError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors });
      return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while creating the comment.',
    });
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id: postId, commentId } = req.params;
    if (!postId || !commentId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Post ID and Comment ID are required' });
      return;
    }

    const token = req.body.jwtToken;
    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token is missing' });
      return;
    }

    // validate the update data and transform it to the DB model format
    const validatedData = commentSchema.parse({
      ...req.body,
      postId,
      id: commentId,
      userId: req.body.userId,
    });

    const updatedComment = await commentsRepository.updateComment(
      commentId,
      validatedData,
      token,
    );

    if (updatedComment) {
      res.status(StatusCodes.OK).json(updatedComment);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Comment not found' });
    }
  } catch (error) {
    console.error('Error updating comment', { error });

    if (error instanceof ZodError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors });
      return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while updating the comment.',
    });
  }
};
