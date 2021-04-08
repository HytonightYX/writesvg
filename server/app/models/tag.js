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
    return await Tag.findAll({
      where: {
        author: 0,
      },
    });
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
    // 记录Id
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // TAG名称
    name: DataTypes.STRING(100),
    author: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    tableName: 'tag',
  }
);

module.exports = { Tag };
