import { Op } from 'sequelize';
import Community from './community.model.js';
import Membership from './membership.model.js';
import User from '../user/user.model.js';
import Post from '../post/post.model.js';
import sequelize from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';

/**
 * Generate a URL-safe slug from a community name.
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Create a new community and add the creator as admin.
 */
export async function createCommunity({ name, description, visibility = 'public' }, creatorId) {
  // Check for duplicate name
  const existing = await Community.findOne({ where: { name } });
  if (existing) {
    throw new AppError('A community with that name already exists', 409);
  }

  const slug = generateSlug(name);

  // Check for duplicate slug
  const slugExists = await Community.findOne({ where: { slug } });
  if (slugExists) {
    throw new AppError('A community with a similar name already exists', 409);
  }

  const community = await Community.create({
    name,
    slug,
    description,
    visibility,
    creatorId,
  });

  // Add creator as admin member
  await Membership.create({
    userId: creatorId,
    communityId: community.id,
    role: 'admin',
  });

  return community;
}

/**
 * Get a community by its slug, including creator info and counts.
 */
export async function getCommunityBySlug(slug, requestingUserId = null) {
  const community = await Community.findOne({
    where: { slug },
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username'],
      },
    ],
  });

  if (!community) {
    throw new AppError('Community not found', 404);
  }

  // Get counts
  const memberCount = await Membership.count({ where: { communityId: community.id } });
  const postCount = await Post.count({ where: { communityId: community.id } });

  // Check if requesting user is a member
  let membership = null;
  if (requestingUserId) {
    membership = await Membership.findOne({
      where: { communityId: community.id, userId: requestingUserId },
    });
  }

  const result = community.toJSON();
  result.memberCount = memberCount;
  result.postCount = postCount;
  result.isMember = !!membership;
  result.memberRole = membership ? membership.role : null;

  return result;
}

/**
 * List communities with optional search, pagination.
 */
export async function listCommunities({ search, limit = 20, offset = 0 } = {}) {
  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  const { rows: communities, count } = await Community.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
  });

  // Get member counts and post counts for each community
  const results = await Promise.all(
    communities.map(async (c) => {
      const memberCount = await Membership.count({ where: { communityId: c.id } });
      const postCount = await Post.count({ where: { communityId: c.id } });
      const json = c.toJSON();
      json.memberCount = memberCount;
      json.postCount = postCount;
      return json;
    }),
  );

  return { communities: results, total: count };
}

/**
 * Update a community. Only the creator can update.
 */
export async function updateCommunity(communityId, updates, userId) {
  const community = await Community.findByPk(communityId);
  if (!community) {
    throw new AppError('Community not found', 404);
  }

  if (community.creatorId !== userId) {
    throw new AppError('Only the community creator can update it', 403);
  }

  // If name is changing, update slug too
  if (updates.name && updates.name !== community.name) {
    const slug = generateSlug(updates.name);
    const existing = await Community.findOne({ where: { slug, id: { [Op.ne]: communityId } } });
    if (existing) {
      throw new AppError('A community with a similar name already exists', 409);
    }
    updates.slug = slug;
  }

  await community.update(updates);
  return community;
}

/**
 * Delete a community. Only the creator can delete.
 */
export async function deleteCommunity(communityId, userId) {
  const community = await Community.findByPk(communityId);
  if (!community) {
    throw new AppError('Community not found', 404);
  }

  if (community.creatorId !== userId) {
    throw new AppError('Only the community creator can delete it', 403);
  }

  // Delete all memberships first
  await Membership.destroy({ where: { communityId } });
  await community.destroy();

  return { message: 'Community deleted' };
}

/**
 * Join a community (create membership).
 */
export async function joinCommunity(communityId, userId) {
  const community = await Community.findByPk(communityId);
  if (!community) {
    throw new AppError('Community not found', 404);
  }

  const existing = await Membership.findOne({
    where: { communityId, userId },
  });
  if (existing) {
    throw new AppError('You are already a member of this community', 400);
  }

  const membership = await Membership.create({
    userId,
    communityId,
    role: 'member',
  });

  return membership;
}

/**
 * Leave a community (delete membership).
 */
export async function leaveCommunity(communityId, userId) {
  const community = await Community.findByPk(communityId);
  if (!community) {
    throw new AppError('Community not found', 404);
  }

  // Creator cannot leave their own community
  if (community.creatorId === userId) {
    throw new AppError('The community creator cannot leave. Transfer ownership or delete the community.', 400);
  }

  const membership = await Membership.findOne({
    where: { communityId, userId },
  });
  if (!membership) {
    throw new AppError('You are not a member of this community', 400);
  }

  await membership.destroy();
  return { message: 'Left community' };
}

/**
 * Check if a user is a member of a community.
 */
export async function getMembership(communityId, userId) {
  const membership = await Membership.findOne({
    where: { communityId, userId },
  });

  return {
    isMember: !!membership,
    role: membership ? membership.role : null,
  };
}

/**
 * Get all communities a user has joined.
 */
export async function getUserCommunities(userId) {
  const memberships = await Membership.findAll({
    where: { userId },
    include: [
      {
        model: Community,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username'],
          },
        ],
      },
    ],
  });

  const results = await Promise.all(
    memberships.map(async (m) => {
      const community = m.Community.toJSON();
      community.memberCount = await Membership.count({ where: { communityId: community.id } });
      community.postCount = await Post.count({ where: { communityId: community.id } });
      community.memberRole = m.role;
      return community;
    }),
  );

  return results;
}
