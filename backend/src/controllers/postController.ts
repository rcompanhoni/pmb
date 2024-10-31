import { Request, Response } from 'express';
import { ZodError } from 'zod';
import * as postsRepository from '../repositories/posts/postsRepository';
import { StatusCodes } from 'http-status-codes';
import { postSchema } from '../repositories/posts/types';

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
    // validate
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
