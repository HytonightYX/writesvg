const { DataTypes, Model } = require('sequelize');
const { db } = require('../../core/db');

/**
 * 文章标签业务
 */
class Tag extends Model {
  /**
   * 展示所有用户标签
   */
  static async showTags() {
    const data = await Tag.findAll();
    return data;
  }

  /**
   * 添加标签方法
   * @param name 标签名
   * @param author 作者id
   */
  static async addTags(name, author) {
    return await Tag.create({
      name: name,
      author: author,
    });
  }
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING(100),
  },
  {
    sequelize: db,
    tableName: 'tag',
  }
);

module.exports = { Tag };
