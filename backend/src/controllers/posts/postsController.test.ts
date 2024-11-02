import { Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from './postsController';
import * as postsRepository from '../../repositories/posts/postsRepository';
import { StatusCodes } from 'http-status-codes';
import { Post, postSchema } from '../../repositories/posts/types';

jest.mock('../../repositories/posts/postsRepository');

describe('postsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let consoleErrorMock: jest.SpyInstance;

  const mockRequestBody = {
    title: 'Test Post',
    content: 'This is a test post.',
    userId: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
    heroImageUrl:
      'https://fastly.picsum.photos/id/584/800/600.jpg?hmac=a3J2cSrpIrYOJYrPB6m_drWlOrh0_0B10VIHEP0qFoY',
    email: 'test@test.com',
    jwtToken: 'valid_token', // added by the middleware
  };

  const mockPost: Post = {
    id: '1',
    title: 'Test Post',
    content: 'This is a test post.',
    created_at: new Date('2024-10-31'),
    user_id: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
    hero_image_url:
      'https://fastly.picsum.photos/id/584/800/600.jpg?hmac=a3J2cSrpIrYOJYrPB6m_drWlOrh0_0B10VIHEP0qFoY',
  };

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
    jest.resetAllMocks();
  });

  describe('getPosts', () => {
    it('should return a paginated list of posts with status 200', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          created_at: '2024-11-01',
        },
      ];
      const mockTotalCount = 1;

      (postsRepository.getAllPosts as jest.Mock).mockResolvedValue({
        posts: mockPosts,
        totalCount: mockTotalCount,
      });

      req.query = { pageSize: '10', page: '1' };

      await getPosts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        posts: mockPosts,
        totalCount: mockTotalCount,
        page: 1,
        pageSize: 10,
      });
    });

    it('should return status 500 if there is an error', async () => {
      (postsRepository.getAllPosts as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await getPosts(req as Request, res as Response);

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
    it('should create a Post with status 201 if validation and authorization pass', async () => {
      req.body = { ...mockPost, jwtToken: 'valid_token' };
      (postsRepository.createPost as jest.Mock).mockResolvedValue(mockPost);
      jest.spyOn(postSchema, 'parse').mockReturnValue(mockPost);

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return status 401 if token is missing', async () => {
      req.body = { ...mockRequestBody, jwtToken: undefined };

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });

    it('should return status 500 if there is an error during creation', async () => {
      // body with data from the request + injected by middleware (userId and jwtToken)
      req.body = mockRequestBody;

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

  describe('updatePost', () => {
    it('should update a Post with status 200 if valid data, token, and id query param are provided', async () => {
      req.params = { id: '1' };
      req.body = { ...mockRequestBody, jwtToken: 'valid-token' };
      (postsRepository.updatePost as jest.Mock).mockResolvedValue(mockPost);

      await updatePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it('should return status 401 if token is missing', async () => {
      req.params = { id: '1' };
      req.body = { ...mockRequestBody, jwtToken: undefined };

      await updatePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });

    it('should return status 400 if post ID is missing', async () => {
      req.params = { id: '' };
      req.body = { ...mockRequestBody };

      await updatePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    it('should return status 404 if post is not found', async () => {
      req.params = { id: '1' };
      req.body = { ...mockRequestBody };
      (postsRepository.updatePost as jest.Mock).mockResolvedValue(null);

      await updatePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });

    it('should return status 400 if validation fails', async () => {
      const zodError = new ZodError([{ message: 'Invalid data' } as ZodIssue]);
      jest.spyOn(postSchema, 'parse').mockImplementation(() => {
        throw zodError;
      });
      req.params = { id: '1' };
      req.body = {};

      await updatePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: zodError.errors });
    });

    it('should return status 500 if there is an internal error', async () => {
      req.params = { id: '1' };
      req.body = { ...mockRequestBody };

      (postsRepository.updatePost as jest.Mock).mockRejectedValue(
        new Error('Internal error'),
      );

      await updatePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('deletePost', () => {
    it('should delete a Post with status 200 if valid id and token are provided', async () => {
      req.params = { id: '1' };
      req.body = { ...mockRequestBody, jwtToken: 'valid-token' };
      (postsRepository.deletePost as jest.Mock).mockResolvedValue(mockPost);

      await deletePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it('should return status 401 if token is missing', async () => {
      req.params = { id: '1' };
      req.body = { ...mockRequestBody, jwtToken: undefined };

      await deletePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });

    it('should return status 400 if post ID is missing', async () => {
      req.params = {};
      req.body = { jwtToken: 'valid_token' };

      await deletePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    it('should return status 404 if post is not found', async () => {
      req.params = { id: '1' };
      req.body = { jwtToken: 'valid_token' };
      (postsRepository.deletePost as jest.Mock).mockResolvedValue(null);

      await deletePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });

    it('should return status 500 if there is an internal error', async () => {
      req.params = { id: '1' };
      req.body = { jwtToken: 'valid_token' };
      (postsRepository.deletePost as jest.Mock).mockRejectedValue(
        new Error('Internal error'),
      );

      await deletePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });
  });
});
