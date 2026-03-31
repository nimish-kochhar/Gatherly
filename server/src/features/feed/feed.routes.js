import { Router } from 'express';
import { fetchFeed } from './feed.controller.js';

const router = Router();

router.get('/', fetchFeed);

export default router;