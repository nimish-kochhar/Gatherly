import { z } from 'zod';

/**
 * Validation schema for creating a post.
 */
export const createPostSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(300, 'Title must be 300 characters or fewer'),
    body: z
      .string()
      .optional()
      .default(''),
    communityId: z
      .number({ required_error: 'Community is required', invalid_type_error: 'Community ID must be a number' })
      .int()
      .positive('Invalid community ID'),
  }),
});
