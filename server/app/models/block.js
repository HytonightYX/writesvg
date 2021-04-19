const { DataTypes, Model } = require('sequelize');
const { db } = require('../../core/db');

class Block extends Model {}

Block.init(
  {
    // 记录ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: DataTypes.ENUM('text', 'image'),
    originUrl: DataTypes.STRING(),
    svgUrl: DataTypes.STRING(),
  },
  {
    sequelize: db,
    tableName: 'block',
    paranoid: true,
  }
);

module.exports = { Block };
