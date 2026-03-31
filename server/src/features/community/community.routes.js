import { Router } from 'express';
import * as communityController from './community.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { createCommunitySchema, updateCommunitySchema } from './community.validator.js';

const router = Router();

/**
 * Optional auth — attaches req.user if token present, but doesn't block.
 */
function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }
  // Reuse the authenticate middleware; if it fails, just continue without user
  authenticate(req, _res, (err) => {
    if (err) {
      // Token invalid — continue without user
      return next();
    }
    next();
  });
}

// ── Public routes ──
router.get('/', communityController.list);

// ── Auth-required routes (order matters — /me/joined before /:slug) ──
router.get('/me/joined', authenticate, communityController.myJoined);
router.post('/', authenticate, validate(createCommunitySchema), communityController.create);

// ── Slug-based route (public, with optional auth for membership info) ──
router.get('/:slug', optionalAuth, communityController.getBySlug);

// ── ID-based routes ──
router.put('/:id', authenticate, validate(updateCommunitySchema), communityController.update);
router.delete('/:id', authenticate, communityController.remove);

// ── Membership routes ──
router.post('/:id/join', authenticate, communityController.join);
router.delete('/:id/join', authenticate, communityController.leave);
router.get('/:id/membership', authenticate, communityController.checkMembership);

export default router;