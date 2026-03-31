import * as communityService from './community.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

/**
 * POST /api/communities — Create a new community.
 */
export const create = catchAsync(async (req, res) => {
  const community = await communityService.createCommunity(req.body, req.user.userId);
  res.status(201).json(community);
});

/**
 * GET /api/communities — List communities (with optional ?search=).
 */
export const list = catchAsync(async (req, res) => {
  const { search, limit, offset } = req.query;
  const result = await communityService.listCommunities({ search, limit, offset });
  res.json(result);
});

/**
 * GET /api/communities/me/joined — Communities the current user has joined.
 */
export const myJoined = catchAsync(async (req, res) => {
  const communities = await communityService.getUserCommunities(req.user.userId);
  res.json({ communities });
});

/**
 * GET /api/communities/:slug — Get a single community by slug.
 */
export const getBySlug = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.userId : null;
  const community = await communityService.getCommunityBySlug(req.params.slug, userId);
  res.json(community);
});

/**
 * PUT /api/communities/:id — Update a community.
 */
export const update = catchAsync(async (req, res) => {
  const community = await communityService.updateCommunity(
    parseInt(req.params.id, 10),
    req.body,
    req.user.userId,
  );
  res.json(community);
});

/**
 * DELETE /api/communities/:id — Delete a community.
 */
export const remove = catchAsync(async (req, res) => {
  const result = await communityService.deleteCommunity(
    parseInt(req.params.id, 10),
    req.user.userId,
  );
  res.json(result);
});

/**
 * POST /api/communities/:id/join — Join a community.
 */
export const join = catchAsync(async (req, res) => {
  const membership = await communityService.joinCommunity(
    parseInt(req.params.id, 10),
    req.user.userId,
  );
  res.status(201).json(membership);
});

/**
 * DELETE /api/communities/:id/join — Leave a community.
 */
export const leave = catchAsync(async (req, res) => {
  const result = await communityService.leaveCommunity(
    parseInt(req.params.id, 10),
    req.user.userId,
  );
  res.json(result);
});

/**
 * GET /api/communities/:id/membership — Check current user's membership.
 */
export const checkMembership = catchAsync(async (req, res) => {
  const result = await communityService.getMembership(
    parseInt(req.params.id, 10),
    req.user.userId,
  );
  res.json(result);
});
