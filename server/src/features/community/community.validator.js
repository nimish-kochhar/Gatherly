import { z } from 'zod';

export const createCommunitySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Community name must be at least 2 characters')
      .max(50, 'Community name must be at most 50 characters')
      .regex(/^[a-zA-Z0-9 _-]+$/, 'Community name can only contain letters, numbers, spaces, hyphens, and underscores'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(500, 'Description must be at most 500 characters'),
    visibility: z.enum(['public', 'private']).optional().default('public'),
  }),
});

export const updateCommunitySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(50)
      .regex(/^[a-zA-Z0-9 _-]+$/)
      .optional(),
    description: z.string().max(500).optional(),
    visibility: z.enum(['public', 'private']).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});
