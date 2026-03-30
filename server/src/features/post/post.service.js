import Post from './post.model.js';
import User from '../user/user.model.js';
import Community from '../community/community.model.js';

/**
 * List posts with author and community info.
 * Supports pagination via limit/offset query params.
 */
export async function listPosts({ limit = 20, offset = 0, sort = 'hot' }) {
  const order =
    sort === 'new'
      ? [['createdAt', 'DESC']]
      : sort === 'top'
        ? [[Post.sequelize.literal('upvotes - downvotes'), 'DESC']]
        : [['createdAt', 'DESC']]; // 'hot' defaults to newest for now

  const { rows: posts, count } = await Post.findAndCountAll({
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
