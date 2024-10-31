import { z } from 'zod';

// transform maps the camelCase names into snake_case which is used by the DB
export const postSchema = z
  .object({
    id: z.string().optional(),
    createdAt: z.date().optional(),
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
    userId: z.string().uuid('Invalid user ID format'),
    heroImageUrl: z.string().optional(),
  })
  .transform(({ createdAt, userId, heroImageUrl, ...rest }) => ({
    created_at: createdAt,
    user_id: userId,
    hero_image_url: heroImageUrl,
    ...rest,
  }));

export type Post = z.infer<typeof postSchema>;
