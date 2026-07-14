import Post from './post.model.js';
import Comment from './comment.model.js';
import Vote from './vote.model.js';
import User from '../user/user.model.js';
import Community from '../community/community.model.js';
import sequelize from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { adjustKarma, calcPostVoteDelta, calcCommentVoteDelta, KARMA } from '../karma/karma.service.js';

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
 * Look up the authenticated user's vote on a single post.
 * Returns 'up', 'down', or null.
 */
async function getUserVoteForPost(postId, userId) {
  if (!userId) return null;
  const vote = await Vote.findOne({
    where: { votableType: 'post', votableId: postId, userId },
  });
  return vote ? vote.value : null;
}

/**
 * Look up the authenticated user's votes for a list of post IDs.
 * Returns a Map<postId, 'up'|'down'>.
 */
async function getUserVotesForPosts(postIds, userId) {
  if (!userId || postIds.length === 0) return new Map();
  const votes = await Vote.findAll({
    where: { votableType: 'post', votableId: postIds, userId },
  });
  const map = new Map();
  for (const v of votes) {
    map.set(v.votableId, v.value);
  }
  return map;
}

/**
 * Recount votes from the Votes table and sync counters on the Post row.
 * Returns { upvotes, downvotes }.
 */
async function syncVoteCounts(postId) {
  const upvotes = await Vote.count({
    where: { votableType: 'post', votableId: postId, value: 'up' },
  });
  const downvotes = await Vote.count({
    where: { votableType: 'post', votableId: postId, value: 'down' },
  });
  await Post.update({ upvotes, downvotes }, { where: { id: postId } });
  return { upvotes, downvotes };
}

/**
 * Cast, toggle, or remove a vote on a post.
 *
 * Logic (mirrors Reddit):
 *  - value='up'   → if already upvoted, remove vote; otherwise set to up
 *  - value='down' → if already downvoted, remove vote; otherwise set to down
 *  - value=null   → remove vote
 *
 * @param {number} postId
 * @param {number} userId
 * @param {'up'|'down'|null} value
 * @returns {Promise<{ upvotes: number, downvotes: number, userVote: string|null }>}
 */
export async function voteOnPost(postId, userId, value) {
  // Verify post exists
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const existing = await Vote.findOne({
    where: { votableType: 'post', votableId: postId, userId },
  });

  let userVote = null;
  let oldValue = existing ? existing.value : null;
  let newValue = null;

  if (value === null) {
    // Explicit remove
    if (existing) await existing.destroy();
    newValue = null;
  } else if (existing) {
    if (existing.value === value) {
      // Toggle off (e.g. upvote when already upvoted → remove)
      await existing.destroy();
      newValue = null;
    } else {
      // Switch vote direction
      existing.value = value;
      await existing.save();
      userVote = value;
      newValue = value;
    }
  } else {
    // New vote
    await Vote.create({
      value,
      votableType: 'post',
      votableId: postId,
      userId,
    });
    userVote = value;
    newValue = value;
  }

  // Adjust post author's karma (skip self-votes)
  const postAuthorId = post.userId;
  if (postAuthorId && postAuthorId !== userId) {
    const karmaDelta = calcPostVoteDelta(oldValue, newValue);
    await adjustKarma(postAuthorId, karmaDelta);
  }

  // Sync vote counters
  const counts = await syncVoteCounts(postId);

  return { ...counts, userVote };
}

/**
 * Recount votes from the Votes table and sync counters on the Comment row.
 * Returns { upvotes, downvotes }.
 */
async function syncCommentVoteCounts(commentId) {
  const upvotes = await Vote.count({
    where: { votableType: 'comment', votableId: commentId, value: 'up' },
  });
  const downvotes = await Vote.count({
    where: { votableType: 'comment', votableId: commentId, value: 'down' },
  });
  await Comment.update({ upvotes, downvotes }, { where: { id: commentId } });
  return { upvotes, downvotes };
}

/**
 * Cast, toggle, or remove a vote on a comment.
 *
 * Logic (mirrors voteOnPost):
 *  - value='up'   → if already upvoted, remove vote; otherwise set to up
 *  - value='down' → if already downvoted, remove vote; otherwise set to down
 *  - value=null   → remove vote
 *
 * @param {number} commentId
 * @param {number} userId
 * @param {'up'|'down'|null} value
 * @returns {Promise<{ upvotes: number, downvotes: number, userVote: string|null }>}
 */
export async function voteOnComment(commentId, userId, value) {
  // Verify comment exists
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  const existing = await Vote.findOne({
    where: { votableType: 'comment', votableId: commentId, userId },
  });

  let userVote = null;
  let oldValue = existing ? existing.value : null;
  let newValue = null;

  if (value === null) {
    // Explicit remove
    if (existing) await existing.destroy();
    newValue = null;
  } else if (existing) {
    if (existing.value === value) {
      // Toggle off (e.g. upvote when already upvoted → remove)
      await existing.destroy();
      newValue = null;
    } else {
      // Switch vote direction
      existing.value = value;
      await existing.save();
      userVote = value;
      newValue = value;
    }
  } else {
    // New vote
    await Vote.create({
      value,
      votableType: 'comment',
      votableId: commentId,
      userId,
    });
    userVote = value;
    newValue = value;
  }

  // Adjust comment author's karma (skip self-votes)
  const commentAuthorId = comment.userId;
  if (commentAuthorId && commentAuthorId !== userId) {
    const karmaDelta = calcCommentVoteDelta(oldValue, newValue);
    await adjustKarma(commentAuthorId, karmaDelta);
  }

  // Sync vote counters
  const counts = await syncCommentVoteCounts(commentId);

  return { ...counts, userVote };
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

  // Award karma for creating a post
  await adjustKarma(userId, KARMA.POST_CREATED);

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
 * Get a single post by ID with author, community, comment count, and user vote.
 *
 * @param {number} id
 * @param {number|null} userId - Optional: authenticated user's ID
 * @returns {Promise<Object>}
 */
export async function getPostById(id, userId = null) {
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

  // Get user vote if authenticated
  const userVote = await getUserVoteForPost(id, userId);

  const result = post.toJSON();
  result.commentCount = commentCount;
  result.userVote = userVote;

  return result;
}

/**
 * List posts with author and community info.
 * Supports pagination via limit/offset query params.
 * Optionally filter by communityId.
 *
 * @param {Object} options
 * @param {number|null} userId - Optional: authenticated user's ID for vote state
 */
export async function listPosts({ limit = 20, offset = 0, sort = 'hot', communityId = null }, userId = null) {
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

  // Batch-fetch user votes for all posts in this page
  const postIds = posts.map((p) => p.id);
  const voteMap = await getUserVotesForPosts(postIds, userId);

  return { posts, count, voteMap };
}

/**
 * Create a comment on a post.
 *
 * @param {number} postId
 * @param {number} userId
 * @param {string} body
 * @param {number|null} parentId - Optional parent comment ID for replies
 * @returns {Promise<Object>} The created comment with author info
 */
export async function createComment(postId, userId, body, parentId = null) {
  // Verify post exists
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // If parentId is provided, verify the parent comment exists and belongs to the same post
  if (parentId) {
    const parentComment = await Comment.findOne({
      where: { id: parentId, postId },
    });
    if (!parentComment) {
      throw new AppError('Parent comment not found', 404);
    }
  }

  const comment = await Comment.create({ body, userId, postId, parentId });

  // Award karma for creating a comment
  await adjustKarma(userId, KARMA.COMMENT_CREATED);

  // Re-fetch with author info
  const fullComment = await Comment.findByPk(comment.id, {
    include: [{ model: User, attributes: ['id', 'username'] }],
  });

  return fullComment;
}

/**
 * Get all comments for a post, structured as top-level comments with nested replies.
 * Fetches all comments in a single flat query, then builds the tree in memory
 * to support arbitrary nesting depth.
 *
 * When userId is provided, each comment includes the user's vote state.
 *
 * @param {number} postId
 * @param {number|null} userId - Optional: authenticated user's ID
 * @returns {Promise<Object[]>} Top-level comments with nested replies
 */
export async function getCommentsByPostId(postId, userId = null) {
  // 1. Flat-fetch all comments for this post with author info
  const allComments = await Comment.findAll({
    where: { postId },
    include: [{ model: User, attributes: ['id', 'username'] }],
    order: [['createdAt', 'ASC']],
  });

  if (allComments.length === 0) return [];

  // 2. Batch-fetch user votes for every comment
  const allCommentIds = allComments.map((c) => c.id);

  let voteMap = new Map();
  if (userId && allCommentIds.length > 0) {
    const votes = await Vote.findAll({
      where: { votableType: 'comment', votableId: allCommentIds, userId },
    });
    for (const v of votes) {
      voteMap.set(v.votableId, v.value);
    }
  }

  // 3. Convert to plain objects, attach userVote, and initialise replies array
  const commentMap = new Map();
  const plainComments = allComments.map((c) => {
    const obj = c.toJSON();
    obj.userVote = voteMap.get(obj.id) || null;
    obj.replies = [];
    commentMap.set(obj.id, obj);
    return obj;
  });

  // 4. Build the tree: attach each comment to its parent's replies array
  const topLevel = [];
  for (const comment of plainComments) {
    if (comment.parentId && commentMap.has(comment.parentId)) {
      commentMap.get(comment.parentId).replies.push(comment);
    } else {
      // Top-level comment (parentId is null, or parent not found)
      topLevel.push(comment);
    }
  }

  return topLevel;
}
