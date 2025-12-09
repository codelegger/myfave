import { z } from "zod";

export const postSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});

export const postListSchema = z.array(postSchema);

export const createPostInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  userId: z.number().int().positive().optional(),
});

export const updatePostInputSchema = createPostInputSchema.partial();

export type Post = z.infer<typeof postSchema>;
export type PostList = z.infer<typeof postListSchema>;
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;
