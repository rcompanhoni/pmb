import { z } from 'zod';

export const postSchema = z
  .object({
    id: z.string().optional(),
    createdAt: z
      .preprocess(
        (val) => (val ? new Date(val as string) : undefined),
        z.date().optional(),
      )
      .default(() => new Date()),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    userId: z
      .string()
      .uuid('Invalid user ID format')
      .transform((val) => val),
  })
  .transform(({ createdAt, userId, ...rest }) => ({
    created_at: createdAt,
    user_id: userId,
    ...rest,
  }));

export type Post = z.infer<typeof postSchema>;
