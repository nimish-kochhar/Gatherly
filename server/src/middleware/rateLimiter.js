// TODO: Implement Redis-backed rate limiter
// Falls back to no-op if Redis is unavailable
export function rateLimiter(_req, _res, next) {
  next();
}
