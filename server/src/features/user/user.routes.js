import { Router } from 'express';
import * as userController from './user.controller.js';

const router = Router();

// GET /api/users/:username — public profile
router.get('/:username', userController.getProfile);

// GET /api/users/:username/karma — karma breakdown
router.get('/:username/karma', userController.getKarmaBreakdown);

export default router;
