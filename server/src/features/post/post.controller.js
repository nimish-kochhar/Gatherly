import * as postService from './post.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

/**
 * GET /api/posts — List posts (feed).
 * Query params: sort (hot|new|top), limit, offset
 */
export const list = catchAsync(async (req, res) => {
  const { sort = 'hot', limit = 20, offset = 0 } = req.query;
  const { posts, count } = await postService.listPosts({ sort, limit, offset });

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
