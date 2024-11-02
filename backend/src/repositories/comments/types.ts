import { z } from 'zod';

// transform maps the camelCase fields into snake_case which is used by the DB
export const commentSchema = z
  .object({
    id: z.string().optional(),
    createdAt: z.date().optional(),
    postId: z.string().uuid('Invalid post ID format'),
    userId: z.string().uuid('Invalid user ID format'),
    content: z.string().optional(),
    email: z.string().optional(),
  })
  .transform(({ createdAt, postId, userId, ...rest }) => ({
    created_at: createdAt,
    post_id: postId,
    user_id: userId,
    ...rest,
  }));

export type Comment = z.infer<typeof commentSchema>;
