import { Router } from 'express';
import * as postController from './post.controller.js';

const router = Router();

// GET /api/posts — public feed
router.get('/', postController.list);

// TODO: POST / (create post — requires auth)
// TODO: GET /:id, PUT /:id, DELETE /:id
// TODO: POST /:id/vote, POST /:id/comments

export default router;
