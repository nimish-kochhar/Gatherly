import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(30), allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: true },
  googleId: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  bio: { type: DataTypes.STRING(500), defaultValue: '' },
  karma: { type: DataTypes.INTEGER, defaultValue: 0 },
  role: { type: DataTypes.ENUM('user', 'admin', 'moderator'), defaultValue: 'user' },
}, {
  indexes: [
    { unique: true, fields: ['username'], name: 'users_username_unique' },
    { unique: true, fields: ['email'], name: 'users_email_unique' },
    { unique: true, fields: ['googleId'], name: 'users_google_id_unique' },
  ],
});

export default User;
