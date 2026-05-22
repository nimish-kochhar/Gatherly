import * as postService from './post.service.js';
import Comment from './comment.model.js';
import sequelize from '../../config/db.js';
import { catchAsync } from '../../utils/catchAsync.js';

/**
 * GET /api/posts — List posts (feed).
 * Query params: sort (hot|new|top), limit, offset, communityId
 *
 * If the request includes a valid JWT (via optionalAuthenticate),
 * each post includes a `userVote` field ('up', 'down', or null).
 */
export const list = catchAsync(async (req, res) => {
  const { sort = 'hot', limit = 20, offset = 0, communityId } = req.query;
  const userId = req.user?.userId || null;

  const { posts, count, voteMap } = await postService.listPosts(
    { sort, limit, offset, communityId },
    userId,
  );

  // Batch-count comments per post
  const postIds = posts.map((p) => p.id);
  const commentCounts = await Comment.findAll({
    where: { postId: postIds },
    attributes: ['postId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['postId'],
    raw: true,
  });
  const commentCountMap = new Map(commentCounts.map((c) => [c.postId, parseInt(c.count, 10)]));

  res.json({
    posts: posts.map((p) => {
      const post = p.toJSON();
      return {
        id: post.id,
        title: post.title,
        body: post.body,
        slug: post.slug,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        commentCount: commentCountMap.get(post.id) || 0,
        createdAt: post.createdAt,
        author: post.author
          ? { id: post.author.id, username: post.author.username }
          : { id: post.userId || 0, username: 'unknown' },
        community: post.Community
          ? { id: post.Community.id, name: post.Community.name, slug: post.Community.slug }
          : null,
        userVote: voteMap.get(post.id) || null,
      };
    }),
    total: count,
  });
});

/**
 * GET /api/posts/:id — Get a single post by ID.
 *
 * If the request includes a valid JWT (via optionalAuthenticate),
 * the response includes a `userVote` field ('up', 'down', or null).
 */
export const getById = catchAsync(async (req, res) => {
  const userId = req.user?.userId || null;
  const post = await postService.getPostById(req.params.id, userId);

  res.json({
    post: {
      id: post.id,
      title: post.title,
      body: post.body,
      slug: post.slug,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      commentCount: post.commentCount || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author
        ? { id: post.author.id, username: post.author.username }
        : { id: post.userId || 0, username: 'unknown' },
      community: post.Community
        ? { id: post.Community.id, name: post.Community.name, slug: post.Community.slug }
        : null,
      userVote: post.userVote || null,
    },
  });
});

/**
 * POST /api/posts — Create a new post (requires authentication).
 */
export const create = catchAsync(async (req, res) => {
  const { title, body, communityId } = req.body;
  const userId = req.user.userId;

  const post = await postService.createPost({ title, body }, communityId, userId);

  const result = post.toJSON();
  res.status(201).json({
    post: {
      id: result.id,
      title: result.title,
      body: result.body,
      slug: result.slug,
      upvotes: result.upvotes,
      downvotes: result.downvotes,
      commentCount: 0,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      author: result.author
        ? { id: result.author.id, username: result.author.username }
        : { id: userId, username: 'unknown' },
      community: result.Community
        ? { id: result.Community.id, name: result.Community.name, slug: result.Community.slug }
        : null,
      userVote: null,
    },
  });
});

/**
 * PUT /api/posts/:id/vote — Cast, toggle, or remove a vote on a post.
 *
 * Body: { value: 'up' | 'down' | null }
 * - 'up'/'down': toggles if already that direction, otherwise sets
 * - null: removes any existing vote
 *
 * Returns: { upvotes, downvotes, userVote }
 */
export const vote = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  const { value } = req.body;

  const result = await postService.voteOnPost(postId, userId, value);

  res.json(result);
});

/**
 * PUT /api/posts/:id/comments/:commentId/vote — Cast, toggle, or remove a vote on a comment.
 *
 * Body: { value: 'up' | 'down' | null }
 * Returns: { upvotes, downvotes, userVote }
 */
export const voteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;
  const { value } = req.body;

  const result = await postService.voteOnComment(commentId, userId, value);

  res.json(result);
});

/**
 * GET /api/posts/:id/comments — List comments for a post.
 */
export const listComments = catchAsync(async (req, res) => {
  const userId = req.user?.userId || null;
  const comments = await postService.getCommentsByPostId(req.params.id, userId);

  res.json({
    comments: comments.map((c) => {
      return {
        id: c.id,
        body: c.body,
        upvotes: c.upvotes,
        downvotes: c.downvotes,
        userVote: c.userVote || null,
        createdAt: c.createdAt,
        author: c.User
          ? { id: c.User.id, username: c.User.username }
          : null,
        replies: (c.replies || []).map((reply) => ({
          id: reply.id,
          body: reply.body,
          upvotes: reply.upvotes,
          downvotes: reply.downvotes,
          userVote: reply.userVote || null,
          createdAt: reply.createdAt,
          author: reply.User
            ? { id: reply.User.id, username: reply.User.username }
            : null,
        })),
      };
    }),
  });
});

/**
 * POST /api/posts/:id/comments — Add a comment to a post (requires authentication).
 */
export const createComment = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  const { body, parentId } = req.body;

  const comment = await postService.createComment(postId, userId, body, parentId);

  const c = comment.toJSON();
  res.status(201).json({
    comment: {
      id: c.id,
      body: c.body,
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      createdAt: c.createdAt,
      parentId: c.parentId,
      author: c.User
        ? { id: c.User.id, username: c.User.username }
        : null,
      replies: [],
    },
  });
});
