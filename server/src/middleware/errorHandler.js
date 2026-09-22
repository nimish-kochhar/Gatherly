/**
 * Central error handler — catches AppError instances and unhandled errors.
 *
 * Handles Sequelize pool/connection errors as 503 rather than crashing,
 * and guards against double-response when headers are already sent.
 */
export function errorHandler(err, _req, res, next) {
  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  // Sequelize pool / connection errors → 503 Service Unavailable
  if (
    err.name === 'SequelizeConnectionError' ||
    err.name === 'SequelizeConnectionAcquireTimeoutError' ||
    err.name === 'TimeoutError' ||
    (err.parent && err.parent.code === 'PROTOCOL_CONNECTION_LOST')
  ) {
    console.error('[DB Error]', err.name, err.message);
    return res.status(503).json({
      status: 'error',
      statusCode: 503,
      message: 'Database temporarily unavailable',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

