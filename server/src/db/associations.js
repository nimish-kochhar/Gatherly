// Central model associations — import all models and define relations here.
// This file is imported once at startup.

// import User from '../features/user/user.model.js';
// import Post from '../features/post/post.model.js';
// import Comment from '../features/post/comment.model.js';
// import Vote from '../features/post/vote.model.js';
// import Media from '../features/media/media.model.js';
// import Community from '../features/community/community.model.js';
// import Membership from '../features/community/membership.model.js';
// import Conversation from '../features/chat/conversation.model.js';
// import Message from '../features/chat/message.model.js';

export function setupAssociations() {
  // --- User ---
  // User.hasMany(Post, { foreignKey: 'userId' });
  // User.hasMany(Comment, { foreignKey: 'userId' });
  // User.hasMany(Vote, { foreignKey: 'userId' });
  // User.hasMany(Media, { as: 'uploads', foreignKey: 'uploadedBy' });
  // User.hasOne(Media, { as: 'avatar', foreignKey: 'attachableId', scope: { attachableType: 'user' } });

  // --- Post ---
  // Post.belongsTo(User, { foreignKey: 'userId' });
  // Post.belongsTo(Community, { foreignKey: 'communityId' });
  // Post.hasMany(Comment, { foreignKey: 'postId' });
  // Post.hasMany(Media, { as: 'attachments', foreignKey: 'attachableId', scope: { attachableType: 'post' } });

  // --- Comment ---
  // Comment.belongsTo(User, { foreignKey: 'userId' });
  // Comment.belongsTo(Post, { foreignKey: 'postId' });
  // Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId' });

  // --- Community ---
  // Community.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
  // Community.hasMany(Post, { foreignKey: 'communityId' });
  // Community.hasOne(Media, { as: 'banner', foreignKey: 'attachableId', scope: { attachableType: 'community' } });
  // Community.belongsToMany(User, { through: Membership, foreignKey: 'communityId' });
  // User.belongsToMany(Community, { through: Membership, foreignKey: 'userId' });

  // --- Chat ---
  // Conversation.hasMany(Message, { foreignKey: 'conversationId' });
  // Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
  // Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
}
