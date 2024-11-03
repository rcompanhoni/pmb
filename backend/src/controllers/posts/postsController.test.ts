import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from './postsController';
import * as postsRepository from '../../repositories/posts/postsRepository';
import { postSchema } from '../../repositories/posts/types';

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
    jwtToken: 'valid_token',
  };

  const mockPost = {
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
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupRepositoryMock = (
    method: keyof typeof postsRepository,
    returnValue: unknown,
  ) => {
    (postsRepository[method] as jest.Mock).mockResolvedValue(returnValue);
  };

  describe('getPosts', () => {
    it('should return a paginated list of posts with status 200', async () => {
      setupRepositoryMock('getAllPosts', { posts: [mockPost], totalCount: 1 });
      req.query = { pageSize: '10', page: '1' };

      await getPosts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        posts: [mockPost],
        totalCount: 1,
        page: 1,
        pageSize: 10,
      });
    });

    it('should return status 500 if there is an error', async () => {
      setupRepositoryMock(
        'getAllPosts',
        Promise.reject(new Error('Database error')),
      );

      await getPosts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('getPost', () => {
    it('should return a single post with status 200 if found', async () => {
      setupRepositoryMock('getPostById', mockPost);
      req.params = { id: '1' };

      await getPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return status 404 if post is not found', async () => {
      setupRepositoryMock('getPostById', null);
      req.params = { id: '1' };

      await getPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Post not found',
      });
    });
  });

  describe('createPost', () => {
    it('should create a Post with status 201 if validation and authorization pass', async () => {
      req.body = mockRequestBody;
      setupRepositoryMock('createPost', mockPost);
      jest.spyOn(postSchema, 'parse').mockReturnValue(mockPost);

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return status 401 if token is missing', async () => {
      req.body = { ...mockRequestBody, jwtToken: undefined };

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Token is missing',
      });
    });
  });

  describe('updatePost', () => {
    it('should update a Post with status 200 if valid data, token, and id are provided', async () => {
      req.params = { id: '1' };
      req.body = { ...mockRequestBody, jwtToken: 'valid_token' };
      setupRepositoryMock('updatePost', mockPost);

      await updatePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return status 401 if token is missing', async () => {
      req.params = { id: '1' };
      req.body = { ...mockRequestBody, jwtToken: undefined };

      await updatePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Token is missing',
      });
    });
  });

  describe('deletePost', () => {
    it('should delete a Post with status 200 if valid id and token are provided', async () => {
      req.params = { id: '1' };
      req.body = { jwtToken: 'valid_token' };
      setupRepositoryMock('deletePost', mockPost);

      await deletePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it('should return status 401 if token is missing', async () => {
      req.params = { id: '1' };
      req.body = { jwtToken: undefined };

      await deletePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Token is missing',
      });
    });
  });
});
