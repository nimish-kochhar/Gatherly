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

/**
 * Validation schema for voting on a post.
 * value: 'up' to upvote, 'down' to downvote, null to remove vote.
 */
export const voteSchema = z.object({
  body: z.object({
    value: z
      .enum(['up', 'down'])
      .nullable(),
  }),
});

/**
 * Validation schema for creating a comment.
 */
export const createCommentSchema = z.object({
  body: z.object({
    body: z
      .string()
      .min(1, 'Comment body is required')
      .max(10000, 'Comment must be 10000 characters or fewer'),
    parentId: z
      .number()
      .int()
      .positive('Invalid parent comment ID')
      .optional(),
  }),
});

/**
 * Validation schema for voting on a comment.
 * value: 'up' to upvote, 'down' to downvote, null to remove vote.
 */
export const commentVoteSchema = z.object({
  body: z.object({
    value: z
      .enum(['up', 'down'])
      .nullable(),
  }),
});

