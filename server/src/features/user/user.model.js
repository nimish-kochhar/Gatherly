import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.STRING(500), defaultValue: '' },
  karma: { type: DataTypes.INTEGER, defaultValue: 0 },
  role: { type: DataTypes.ENUM('user', 'admin', 'moderator'), defaultValue: 'user' },
});

export default User;
