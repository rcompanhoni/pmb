import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from './commentsController';
import * as commentsRepository from '../../repositories/comments/commentsRepository';
import { commentSchema } from '../../repositories/comments/types';
import { ZodError, ZodIssue } from 'zod';

jest.mock('../../repositories/comments/commentsRepository');

describe('commentsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let consoleErrorMock: jest.SpyInstance;

  const mockRequestBody = {
    content: 'This is a comment created',
    userId: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
    jwtToken: 'valid_token',
  };

  const mockComment = {
    id: '1',
    post_id: 'e1d148a0-b074-41c7-b61c-7c781c129042',
    user_id: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
    content: 'This is a comment.',
    created_at: new Date('2024-10-31'),
    email: 'test@test.com',
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
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupRepositoryMock = (
    method: keyof typeof commentsRepository,
    returnValue: unknown,
  ) => {
    (commentsRepository[method] as jest.Mock).mockResolvedValue(returnValue);
  };

  describe('getCommentsByPostId', () => {
    it('should return a list of Comments with status 200 if postId is valid', async () => {
      req.params = { id: mockComment.post_id };
      setupRepositoryMock('getCommentsByPostId', [mockComment]);

      await getCommentsByPostId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith([mockComment]);
    });

    it('should return status 400 if postId is missing', async () => {
      req.params = {};

      await getCommentsByPostId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    it('should return status 500 if there is an internal error', async () => {
      req.params = { id: mockComment.post_id };
      setupRepositoryMock(
        'getCommentsByPostId',
        Promise.reject(new Error('Internal error')),
      );

      await getCommentsByPostId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('createComment', () => {
    it('should create a comment and return status 201 if validation and authorization pass', async () => {
      req.params = { id: mockComment.post_id };
      req.body = { ...mockRequestBody };
      setupRepositoryMock('createComment', mockComment);
      jest.spyOn(commentSchema, 'parse').mockReturnValue(mockComment);

      await createComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it('should return status 400 if post ID is missing', async () => {
      req.params = {}; // missing the post ID
      req.body = { ...mockRequestBody };

      await createComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    it('should return status 401 if token is missing', async () => {
      req.params = { id: mockComment.post_id };
      req.body = { ...mockRequestBody, jwtToken: undefined };

      await createComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });

    it('should return status 400 if validation fails', async () => {
      req.params = { id: mockComment.post_id };
      req.body = { ...mockRequestBody, userId: undefined }; // invalid content
      const zodError = new ZodError([{ message: 'Invalid data' } as ZodIssue]);
      jest.spyOn(commentSchema, 'parse').mockImplementation(() => {
        throw zodError;
      });

      await createComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: zodError.errors });
    });
  });

  describe('updateComment', () => {
    it('should update a comment and return status 200 if validation and authorization pass', async () => {
      req.params = { id: mockComment.post_id, commentId: '1' };
      req.body = { ...mockRequestBody };
      setupRepositoryMock('updateComment', mockComment);
      jest.spyOn(commentSchema, 'parse').mockReturnValue(mockComment);

      await updateComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it('should return status 400 if post ID or comment ID is missing', async () => {
      req.params = { id: '', commentId: '' };
      req.body = { content: mockComment.content, jwtToken: 'valid_token' };

      await updateComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    it('should return status 401 if token is missing', async () => {
      req.params = { id: mockComment.post_id, commentId: '1' };
      req.body = { content: mockComment.content, jwtToken: undefined };

      await updateComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });

    it('should return status 400 if validation fails', async () => {
      req.params = { id: mockComment.post_id, commentId: '1' };
      req.body = { ...mockRequestBody, userId: undefined };
      const zodError = new ZodError([{ message: 'Invalid data' } as ZodIssue]);
      jest.spyOn(commentSchema, 'parse').mockImplementation(() => {
        throw zodError;
      });

      await updateComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: zodError.errors });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment and return status 200 if valid post ID, comment ID, and token are provided', async () => {
      req.params = { id: mockComment.post_id, commentId: '1' };
      req.body = { jwtToken: 'valid_token' };
      setupRepositoryMock('deleteComment', { id: '1' });

      await deleteComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it('should return status 400 if post ID or comment ID is missing', async () => {
      req.params = { id: '', commentId: '' };
      req.body = { jwtToken: 'valid_token' };

      await deleteComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    it('should return status 401 if token is missing', async () => {
      req.params = { id: mockComment.post_id, commentId: '1' };
      req.body = { jwtToken: undefined };

      await deleteComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });
  });
});
