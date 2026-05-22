import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const ConversationParticipant = sequelize.define('ConversationParticipant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true, // track when they joined
});

export default ConversationParticipant;
