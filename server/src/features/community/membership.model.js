import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Membership = sequelize.define('Membership', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  role: { type: DataTypes.ENUM('member', 'moderator', 'admin'), defaultValue: 'member' },
  // userId and communityId set via associations
});

export default Membership;
