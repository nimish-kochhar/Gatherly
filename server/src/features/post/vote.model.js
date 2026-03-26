import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Vote = sequelize.define('Vote', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  value: { type: DataTypes.ENUM('up', 'down'), allowNull: false },
  votableType: { type: DataTypes.STRING, allowNull: false },
  votableId: { type: DataTypes.INTEGER, allowNull: false },
  // userId set via association
});

export default Vote;
