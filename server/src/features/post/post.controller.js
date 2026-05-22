import * as postService from './post.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

/**
 * GET /api/posts — List posts (feed).
 * Query params: sort (hot|new|top), limit, offset, communityId
 */
export const list = catchAsync(async (req, res) => {
  const { sort = 'hot', limit = 20, offset = 0, communityId } = req.query;
  const { posts, count } = await postService.listPosts({ sort, limit, offset, communityId });

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
        commentCount: 0, // TODO: count from comments table
        createdAt: post.createdAt,
        author: post.author
          ? { id: post.author.id, username: post.author.username }
          : { id: post.userId || 0, username: 'unknown' },
        community: post.Community
          ? { id: post.Community.id, name: post.Community.name, slug: post.Community.slug }
          : null,
      };
    }),
    total: count,
  });
});

/**
 * GET /api/posts/:id — Get a single post by ID.
 */
export const getById = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.id);

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
    },
  });
});
