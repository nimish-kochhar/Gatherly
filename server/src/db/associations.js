// Central model associations — import all models and define relations here.
// This file is imported once at startup.

import User from '../features/user/user.model.js';
import Post from '../features/post/post.model.js';
import Comment from '../features/post/comment.model.js';
import Community from '../features/community/community.model.js';
import Membership from '../features/community/membership.model.js';

export function setupAssociations() {
  // --- User ---
  User.hasMany(Post, { foreignKey: 'userId' });
  User.hasMany(Comment, { foreignKey: 'userId' });

  // --- Post ---
  Post.belongsTo(User, { as: 'author', foreignKey: 'userId' });
  Post.belongsTo(Community, { foreignKey: 'communityId' });
  Post.hasMany(Comment, { foreignKey: 'postId' });

  // --- Comment ---
  Comment.belongsTo(User, { foreignKey: 'userId' });
  Comment.belongsTo(Post, { foreignKey: 'postId' });
  Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId' });

  // --- Community ---
  Community.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
  Community.hasMany(Post, { foreignKey: 'communityId' });
  Community.belongsToMany(User, { through: Membership, foreignKey: 'communityId' });
  User.belongsToMany(Community, { through: Membership, foreignKey: 'userId' });

  // --- Membership (direct associations for service queries) ---
  Membership.belongsTo(Community, { foreignKey: 'communityId' });
  Membership.belongsTo(User, { foreignKey: 'userId' });
  Community.hasMany(Membership, { foreignKey: 'communityId' });
  User.hasMany(Membership, { foreignKey: 'userId' });
}
