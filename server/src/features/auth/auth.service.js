import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import { AppError } from '../../utils/AppError.js';
import User from '../user/user.model.js';

const SALT_ROUNDS = 12;

/**
 * Register a new user.
 */
export async function register({ username, email, password }) {
  // Check for existing user
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new AppError('Email already in use', 409);

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) throw new AppError('Username already taken', 409);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const { accessToken, refreshToken } = generateTokenPair(user.id);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

/**
 * Login with email + password.
 */
export async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const { accessToken, refreshToken } = generateTokenPair(user.id);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
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

/**
 * Get current user by ID (for /me endpoint).
 */
export async function getCurrentUser(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);
  return sanitizeUser(user);
}

/**
 * Strip password from user object before sending to client.
 */
function sanitizeUser(user) {
  const { password, ...rest } = user.toJSON();
  return rest;
}
