import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import { AppError } from '../../utils/AppError.js';

// TODO: Import User model once created
// import User from '../user/user.model.js';

/**
 * Register a new user.
 */
export async function register({ username, email, password }) {
  // TODO: Check if user exists, hash password, create user, generate tokens
  throw new AppError('Not implemented', 501);
}

/**
 * Login with email + password.
 */
export async function login({ email, password }) {
  // TODO: Find user, compare password, generate tokens
  throw new AppError('Not implemented', 501);
}

/**
 * Generate an access + refresh token pair.
 */
export function generateTokenPair(userId) {
  const accessToken = jwt.sign({ userId }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  });
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });
  return { accessToken, refreshToken };
}

/**
 * Verify a refresh token and issue a new access token.
 */
export async function refreshAccessToken(token) {
  if (!token) throw new AppError('No refresh token', 401);

  const payload = jwt.verify(token, config.jwt.refreshSecret);
  const accessToken = jwt.sign({ userId: payload.userId }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  });

  return { accessToken };
}
