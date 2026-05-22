import { Router } from 'express';
import * as postController from './post.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { optionalAuthenticate } from '../../middleware/optionalAuthenticate.js';
import { validate } from '../../middleware/validate.js';
import { createPostSchema, voteSchema, createCommentSchema, commentVoteSchema } from './post.validator.js';

const router = Router();

// GET /api/posts — public feed (optionally includes userVote if logged in)
router.get('/', optionalAuthenticate, postController.list);

// GET /api/posts/:id — single post (optionally includes userVote if logged in)
router.get('/:id', optionalAuthenticate, postController.getById);

// POST /api/posts — create post (requires auth)
router.post('/', authenticate, validate(createPostSchema), postController.create);

// PUT /api/posts/:id/vote — cast/toggle/remove vote (requires auth)
router.put('/:id/vote', authenticate, validate(voteSchema), postController.vote);

// PUT /api/posts/:id/comments/:commentId/vote — vote on a comment (requires auth)
router.put('/:id/comments/:commentId/vote', authenticate, validate(commentVoteSchema), postController.voteComment);

// GET /api/posts/:id/comments — list comments for a post
router.get('/:id/comments', optionalAuthenticate, postController.listComments);

// POST /api/posts/:id/comments — add a comment (requires auth)
router.post('/:id/comments', authenticate, validate(createCommentSchema), postController.createComment);

export default router;
