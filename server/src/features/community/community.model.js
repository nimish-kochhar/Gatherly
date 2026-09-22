import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Community = sequelize.define('Community', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  slug: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  visibility: {
    type: DataTypes.ENUM('public', 'private'),
    defaultValue: 'public',
  },
  banner: { type: DataTypes.STRING, defaultValue: null },
  icon: { type: DataTypes.STRING, defaultValue: null },
  // creatorId set via association
}, {
  indexes: [
    { unique: true, fields: ['name'], name: 'community_name_unique' },
    { unique: true, fields: ['slug'], name: 'community_slug_unique' },
  ],
});

export default Community;
