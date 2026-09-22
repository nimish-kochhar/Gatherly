import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(300), allowNull: false },
  body: { type: DataTypes.TEXT },
  slug: { type: DataTypes.STRING },
  upvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
  downvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
  // userId and communityId set via associations
}, {
  indexes: [
    { unique: true, fields: ['slug'], name: 'posts_slug_unique' },
  ],
});

export default Post;
