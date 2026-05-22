import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Optional authentication middleware.
 *
 * Attempts to parse the JWT from the Authorization header.
 * If valid, sets req.user = { userId }. Otherwise, continues
 * without setting req.user (does NOT reject the request).
 *
 * Use this on public endpoints that optionally return user-specific
 * data (e.g. the current user's vote on a post).
 */
export function optionalAuthenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1];
      req.user = jwt.verify(token, config.jwt.accessSecret);
    } catch {
      // Token invalid/expired — continue as unauthenticated
    }
  }
  next();
}
