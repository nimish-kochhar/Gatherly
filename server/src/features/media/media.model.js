import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Media = sequelize.define('Media', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false },
  publicId: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('image', 'video'), allowNull: false },
  attachableType: { type: DataTypes.STRING, allowNull: false },
  attachableId: { type: DataTypes.INTEGER, allowNull: false },
  uploadedBy: { type: DataTypes.INTEGER, allowNull: false },
  bytes: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export default Media;
