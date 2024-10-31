import { supabase } from '../../config/supabaseClient';
import { getCommentsByPostId } from './commentsRepository';
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
  const mockComment: Comment = {
    id: '1',
    post_id: 'e1d148a0-b074-41c7-b61c-7c781c129042',
    user_id: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
    content: 'This is a test comment.',
    created_at: new Date('2024-10-31'),
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
        eq: jest.fn().mockResolvedValue({ data: [mockComment], error: null }),
      });

      const result = await getCommentsByPostId(mockComment.post_id);
      expect(result).toEqual([mockComment]);
    });

    it('should return an empty array if an error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
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
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const result = await getCommentsByPostId('non-existent-post-id');
      expect(result).toEqual([]);
    });
  });
});
