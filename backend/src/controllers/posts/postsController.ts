import { Request, Response } from 'express';
import { ZodError } from 'zod';
import * as postsRepository from '../../repositories/posts/postsRepository';
import { StatusCodes } from 'http-status-codes';
import { postSchema } from '../../repositories/posts/types';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await postsRepository.getAllPosts();
    res.status(StatusCodes.OK).json(posts);
  } catch (error) {
    console.error('Error fetching posts', { error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'An error occurred while retrieving posts.' });
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await postsRepository.getPostById(id);

    if (post) {
      res.status(StatusCodes.OK).json(post);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(`Error fetching post with ID ${req.params.id}`, { error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'An error occurred while retrieving the post.' });
  }
};

export const createPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // validate and transform the body data to the proper expected DB model
    const validatedData = postSchema.parse(req.body);

    // check for the JWT token
    const token = req.body.jwtToken;
    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token is missing' });
      return;
    }

    // persist
    const newPost = await postsRepository.createPost(validatedData, token);
    res.status(StatusCodes.CREATED).json(newPost);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors });
      return;
    }

    console.error('Error creating post', { error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while creating the post.',
    });
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // validate and transform the body data to the proper expected DB model
    const validatedData = postSchema.parse(req.body);

    // check for the JWT token
    const token = req.body.jwtToken;
    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token is missing' });
      return;
    }

    // check for the ID param
    const { id } = req.params;
    if (!id) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'The Post id is missing' });
      return;
    }

    // persist
    const updatedPost = await postsRepository.updatePost(
      id,
      validatedData,
      token,
    );
    if (updatedPost) {
      res.status(StatusCodes.OK).json(updatedPost);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Post not found' });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors });
      return;
    }

    console.error('Error updating post', { error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while updating the post.',
    });
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // check for the JWT token
    const token = req.body.jwtToken;
    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token is missing' });
      return;
    }

    // check for the ID param
    const { id } = req.params;
    if (!id) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'The Post id is missing' });
      return;
    }

    // persist
    const deletedPost = await postsRepository.deletePost(id, token);
    if (deletedPost) {
      res.status(StatusCodes.OK).json({ message: 'Post deleted successfully' });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting post', { error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while deleting the post.',
    });
  }
};
