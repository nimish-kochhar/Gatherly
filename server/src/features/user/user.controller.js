import * as userService from './user.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

/**
 * GET /api/users/:username — Get a user's public profile.
 */
export const getProfile = catchAsync(async (req, res) => {
  const { username } = req.params;
  const user = await userService.getUserByUsername(username);

  res.json({ user });
});

/**
 * GET /api/users/:username/karma — Get a detailed karma breakdown.
 */
export const getKarmaBreakdown = catchAsync(async (req, res) => {
  const { username } = req.params;
  const user = await userService.getUserByUsername(username);
  const breakdown = await userService.getKarmaBreakdown(user.id);

  res.json({ karma: breakdown });
});
