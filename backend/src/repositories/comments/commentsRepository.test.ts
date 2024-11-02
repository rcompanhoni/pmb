import { supabase } from '../../config/supabaseClient';
import {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from './commentsRepository';
import { Comment } from './types';

jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}));

describe('commentsRepository', () => {
  let consoleErrorMock: jest.SpyInstance;

  const postId = '6a6c8b6c-6787-45b4-8332-ca5aa204ba9e';
  const commentId = 'e1f1baa1-c2b4-4d08-8a42-3901ed5d8f68';

  const mockComment: Comment = {
    id: '1',
    post_id: 'e1d148a0-b074-41c7-b61c-7c781c129042',
    user_id: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
    content: 'This is a test comment.',
    created_at: new Date('2024-10-31'),
    email: 'test@test.com',
  };

  beforeAll(() => {
    // mock console.error to suppress error output in test logs
    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommentsByPostId', () => {
    it('should return an array of Comment if no error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest
          .fn()
          .mockResolvedValue({ data: [mockComment], error: null }),
      });

      const result = await getCommentsByPostId(mockComment.post_id);
      expect(result).toEqual([mockComment]);
    });

    it('should return an empty array if an error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Some error' },
        }),
      });

      const result = await getCommentsByPostId(mockComment.post_id);
      expect(result).toEqual([]);
    });

    it('should return an empty array if there are no comments for the post', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const result = await getCommentsByPostId('non-existent-post-id');
      expect(result).toEqual([]);
    });
  });

  describe('createComment', () => {
    it('should return the created comment if insertion is successful', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockComment, error: null }),
      });

      const result = await createComment(mockComment, 'valid_token');
      expect(result).toEqual(mockComment);
    });

    it('should return null if insertion fails', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      });

      const result = await createComment(mockComment, 'valid_token');
      expect(result).toBeNull();
    });
  });

  describe('updateComment', () => {
    it('should return the updated comment if no error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockComment, error: null }),
      });

      const result = await updateComment(postId, mockComment, 'valid_token');
      expect(result).toEqual(mockComment);
    });

    it('should return null if there is an error during update', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Some error' },
        }),
      });

      const result = await updateComment(postId, mockComment, 'valid_token');
      expect(result).toBeNull();
    });

    it('should return null if no comment data is found after update', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      const result = await updateComment(postId, mockComment, 'valid_token');
      expect(result).toBeNull();
    });
  });

  describe('deleteComment', () => {
    it('should return the deleted comment data if no error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockComment, error: null }),
      });

      const result = await deleteComment(commentId, 'valid_token');
      expect(result).toEqual(mockComment);
    });

    it('should return null and log an error if an error occurs during deletion', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Some error' },
        }),
      });

      const result = await deleteComment(commentId, 'valid_token');
      expect(result).toBeNull();
    });

    it('should return null if no data is found after deletion', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      const result = await deleteComment(
        'non-existent-comment-id',
        'valid_token',
      );
      expect(result).toBeNull();
    });
  });
});
