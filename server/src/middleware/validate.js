import { AppError } from '../utils/AppError.js';

/**
 * Generic zod validation middleware.
 * Validates req.body, req.query, and req.params against a zod schema.
 */
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message).join(', ');
      return next(new AppError(messages, 400));
    }

    next();
  };
}
