import { supabase } from '../../config/supabaseClient';
import { getAllPosts, getPostById, createPost } from './postsRepository';
import { Post } from './types';

// Supabase client mock
jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  },
}));

describe('postsRepository', () => {
  let consoleErrorMock: jest.SpyInstance;
  const mockPost: Post = {
    id: '1',
    title: 'Test Post',
    content: 'This is a test post.',
    created_at: new Date('2024-10-31'),
    user_id: '9bc47e64-8830-416b-9b15-0ad1458cf1ff',
    hero_image_url: `https://fastly.picsum.photos/id/584/800/600.jpg?hmac=a3J2cSrpIrYOJYrPB6m_drWlOrh0_0B10VIHEP0qFoY`,
  };

  beforeAll(() => {
    // avoid console.error at the terminal from test results
    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterAll(() => {
    // restore console.error
    consoleErrorMock.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('should return a list of posts if no error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [mockPost], error: null }),
      });

      const result = await getAllPosts();
      expect(result).toEqual([mockPost]);
    });

    it('should return an empty array if an error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      });

      const result = await getAllPosts();
      expect(result).toEqual([]);
    });
  });

  describe('getPostById', () => {
    it('should return a single post if it exists and no error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockPost, error: null }),
      });

      const result = await getPostById('1');
      expect(result).toEqual(mockPost);
    });

    it('should return null if an error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Some error' },
        }),
      });

      const result = await getPostById('1');
      expect(result).toBeNull();
    });
  });

  describe('createPost', () => {
    it('should return the created post data if no error occurs', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockResolvedValue({ data: mockPost, error: null }),
      });

      const result = await createPost(mockPost, 'valid_token');
      expect(result).toEqual(mockPost);
    });

    it('should return null if an error occurs during post creation', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      });

      const result = await createPost(mockPost, 'valid_token');
      expect(result).toBeNull();
    });
  });
});
