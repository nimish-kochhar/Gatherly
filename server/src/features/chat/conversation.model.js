import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Conversation = sequelize.define('Conversation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // participants managed via a join table or association
});

export default Conversation;
