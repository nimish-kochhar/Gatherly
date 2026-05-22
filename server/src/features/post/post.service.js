import Post from './post.model.js';
import Comment from './comment.model.js';
import User from '../user/user.model.js';
import Community from '../community/community.model.js';
import sequelize from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';

/**
 * Generate a URL-safe slug from a post title + id suffix.
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Create a new post.
 *
 * @param {{ title: string, body?: string, communityId: number }} data
 * @param {number} userId - The authenticated user's ID
 * @returns {Promise<Object>} The created post with author and community info
 */
export async function createPost({ title, body = '' }, communityId, userId) {
  // Verify the community exists
  const community = await Community.findByPk(communityId);
  if (!community) {
    throw new AppError('Community not found', 404);
  }

  const baseSlug = generateSlug(title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const post = await Post.create({
    title,
    body,
    slug,
    userId,
    communityId,
  });

  // Re-fetch with associations for the response
  const fullPost = await Post.findByPk(post.id, {
    include: [
      { model: User, as: 'author', attributes: ['id', 'username'] },
      { model: Community, attributes: ['id', 'name', 'slug'] },
    ],
  });

  return fullPost;
}

/**
 * Get a single post by ID with author, community, and comment count.
 *
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function getPostById(id) {
  const post = await Post.findByPk(id, {
    include: [
      { model: User, as: 'author', attributes: ['id', 'username'] },
      { model: Community, attributes: ['id', 'name', 'slug'] },
    ],
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Get comment count
  const commentCount = await Comment.count({ where: { postId: id } });

  const result = post.toJSON();
  result.commentCount = commentCount;

  return result;
}

/**
 * List posts with author and community info.
 * Supports pagination via limit/offset query params.
 * Optionally filter by communityId.
 */
export async function listPosts({ limit = 20, offset = 0, sort = 'hot', communityId = null }) {
  const order =
    sort === 'new'
      ? [['createdAt', 'DESC']]
      : sort === 'top'
        ? [[Post.sequelize.literal('upvotes - downvotes'), 'DESC']]
        : [['createdAt', 'DESC']]; // 'hot' defaults to newest for now

  const where = {};
  if (communityId) {
    where.communityId = parseInt(communityId, 10);
  }

  const { rows: posts, count } = await Post.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username'],
      },
      {
        model: Community,
        attributes: ['id', 'name', 'slug'],
      },
    ],
    order,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
  });

  return { posts, count };
}
