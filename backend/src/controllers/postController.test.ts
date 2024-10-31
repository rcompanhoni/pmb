import { Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { getPosts, getPost, createPost } from './postController';
import * as postsRepository from '../repositories/posts/postsRepository';
import { StatusCodes } from 'http-status-codes';
import { Post, postSchema } from '../repositories/posts/types';

jest.mock('../repositories/posts/postsRepository');

describe('postsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let consoleErrorMock: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('should return a list of posts with status 200', async () => {
      const mockPosts = [
        { id: '1', title: 'Test Post', content: 'Test content' },
      ];
      (postsRepository.getAllPosts as jest.Mock).mockResolvedValue(mockPosts);

      await getPosts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    it('should return status 500 if there is an error', async () => {
      (postsRepository.getAllPosts as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await getPosts(req as Request, res as Response);

      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error fetching posts',
        expect.any(Object),
      );
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('getPost', () => {
    it('should return a single post with status 200 if found', async () => {
      const mockPost = { id: '1', title: 'Test Post', content: 'Test content' };
      req.params = { id: '1' };
      (postsRepository.getPostById as jest.Mock).mockResolvedValue(mockPost);

      await getPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return status 404 if post is not found', async () => {
      req.params = { id: '1' };
      (postsRepository.getPostById as jest.Mock).mockResolvedValue(null);

      await getPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });

    it('should return status 500 if there is an error', async () => {
      req.params = { id: '1' };
      (postsRepository.getPostById as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await getPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('createPost', () => {
    const mockPost: Post = {
      id: '1',
      title: 'Test Post',
      content: 'This is a test post.',
      created_at: new Date('2024-10-31'),
      user_id: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
    };

    it('should create a post with status 201 if validation and authorization pass', async () => {
      req.body = { ...mockPost, jwtToken: 'valid_token' };
      (postsRepository.createPost as jest.Mock).mockResolvedValue(mockPost);
      jest.spyOn(postSchema, 'parse').mockReturnValue(mockPost);

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return status 401 if token is missing', async () => {
      req.body = {
        title: 'Test Post',
        content: 'This is a test post.',
        userId: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
      };

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });

    it('should return status 500 if there is an error during creation', async () => {
      // body with data from the request + injected by middleware (userId and jwtToken)
      req.body = {
        title: 'Test Post',
        content: 'This is a test post.',
        userId: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
        jwtToken: 'valid_token',
      };

      (postsRepository.createPost as jest.Mock).mockRejectedValue(
        new Error('Some error'),
      );

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });

    it('should return status 400 if validation fails', async () => {
      const zodError = new ZodError([{ message: 'Invalid data' } as ZodIssue]);
      jest.spyOn(postSchema, 'parse').mockImplementation(() => {
        throw zodError;
      });
      req.body = {};

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: zodError.errors });
    });
  });
});