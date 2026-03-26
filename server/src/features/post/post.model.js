import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(300), allowNull: false },
  body: { type: DataTypes.TEXT },
  slug: { type: DataTypes.STRING, unique: true },
  upvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
  downvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
  // userId and communityId set via associations
});

export default Post;
