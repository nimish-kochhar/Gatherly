import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { AppError } from '../utils/AppError.js';

/**
 * Verify JWT access token from Authorization header.
 * Attaches req.user = { userId }.
 */
export function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Not authenticated', 401));
  }

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, config.jwt.accessSecret);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}
