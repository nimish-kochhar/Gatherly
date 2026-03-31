import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Community = sequelize.define('Community', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  slug: { type: DataTypes.STRING, unique: true },
  description: { type: DataTypes.TEXT },
  visibility: {
    type: DataTypes.ENUM('public', 'private'),
    defaultValue: 'public',
  },
  banner: { type: DataTypes.STRING, defaultValue: null },
  icon: { type: DataTypes.STRING, defaultValue: null },
  // creatorId set via association
});

export default Community;
