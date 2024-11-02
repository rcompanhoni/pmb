import { z } from "zod";

// validation schema
export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  heroImageUrl: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image URL is required"),
  content: z.string().min(1, "Content is required"),
});

export type PostFormData = {
  title: string;
  heroImageUrl: string;
  content: string;
  email?: string;
};
