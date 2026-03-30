import * as authService from './auth.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({ user, accessToken });
});

export const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ user, accessToken });
});

export const refresh = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  const { accessToken } = await authService.refreshAccessToken(token);
  res.json({ accessToken });
});

export const logout = catchAsync(async (_req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

export const me = catchAsync(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);
  res.json({ user });
});
