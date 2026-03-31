// TODO: Implement feed service (home + popular algorithms)
import Post from '../post/post.model.js';
import User from '../user/user.model.js';
import Community from '../community/community.model.js';

export async function getFeed({ limit = 20, offset = 0 }) {
  const posts = await Post.findAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['id', 'username']
      },
      {
        model: Community,
        attributes: ['id', 'name', 'slug']
      }
    ]
  });

  return posts;
}