import { Router } from 'express';
import * as postController from './post.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { createPostSchema } from './post.validator.js';

const router = Router();

// GET /api/posts — public feed
router.get('/', postController.list);

// GET /api/posts/:id — single post
router.get('/:id', postController.getById);

// POST /api/posts — create post (requires auth)
router.post('/', authenticate, validate(createPostSchema), postController.create);

export default router;
