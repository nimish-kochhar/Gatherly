import { AppError } from '../utils/AppError.js';

/**
 * Check if authenticated user has one of the allowed roles.
 * Usage: authorize('admin', 'moderator')
 */
export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
}
