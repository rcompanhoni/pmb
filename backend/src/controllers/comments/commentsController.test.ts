import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getCommentsByPostId } from './commentsController';
import * as commentsRepository from '../../repositories/comments/commentsRepository';

jest.mock('../../repositories/comments/commentsRepository');

describe('commentsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let consoleErrorMock: jest.SpyInstance;

  const mockComment = {
    id: '1',
    post_id: 'e1d148a0-b074-41c7-b61c-7c781c129042',
    user_id: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
    content: 'This is a comment.',
    created_at: new Date('2024-10-31'),
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

  describe('getCommentsByPostId', () => {
    it('should return a list of Comments with status 200 if postId is valid', async () => {
      req.params = { id: 'e1d148a0-b074-41c7-b61c-7c781c129042' };
      (commentsRepository.getCommentsByPostId as jest.Mock).mockResolvedValue([
        mockComment,
      ]);

      await getCommentsByPostId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith([mockComment]);
    });

    it('should return status 400 if postId is missing', async () => {
      req.params = {}; // missing postId

      await getCommentsByPostId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });

    it('should return status 500 if there is an internal error', async () => {
      req.params = { id: 'e1d148a0-b074-41c7-b61c-7c781c129042' };
      (commentsRepository.getCommentsByPostId as jest.Mock).mockRejectedValue(
        new Error('Internal error'),
      );

      await getCommentsByPostId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });
  });
});
