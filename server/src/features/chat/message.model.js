import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: false },
  // senderId and conversationId set via associations
});

export default Message;
