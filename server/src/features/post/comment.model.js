import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  body: { type: DataTypes.TEXT, allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true },
  // userId and postId set via associations
});

export default Comment;
