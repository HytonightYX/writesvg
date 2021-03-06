const { forOwn } = require('lodash');
const { DataTypes, Model, QueryTypes, where } = require('sequelize');
const { db } = require('../../core/db');
const { Tag } = require('../models/tag');
const { User } = require('./user');

/**
 * 笔记文章业务
 */
class Note extends Model {
  /**
   * 新增文章,存草稿或者直接发布
   */
  static async addNote(payload) {
    const { tags } = payload;

    const post = await Note.create({
      ...payload,
    });

    const tagsInDb = await Tag.bulkCreate(tags.map((tag) => ({ name: tag })));

    await post.addTags(tagsInDb);
  }

  /**
   * 按更新时间降序排序
   */
  static async showAllNotes(content = true) {
    let sql = `
		SELECT u.user_name, u.avatar, n.*
		FROM note n 
		LEFT JOIN user u ON n.author = u.id
		order by n.created_at DESC
		`;

    if (!content) {
      sql = `
				SELECT u.user_name, u.avatar, n.title,n.id,n.author,n.created_at,n.like_num,n.collect_num,n.tag,n.cover
				FROM note n 
				LEFT JOIN user u ON n.author = u.id
				order by n.created_at DESC
				`;
    }

    let posts = await db.query(sql, { type: QueryTypes.SELECT });

    return posts;
  }

  /**
   * 按更新时间降序排序
   */
  static async showHotNotes() {
    // let posts = await db.query(
    //   `
    // 	SELECT u.user_name, u.avatar, n.title,n.tag,n.id
    // 	FROM note n
    // 	LEFT JOIN user u ON n.author = u.id
    // 	order by n.updated_at DESC
    // 	LIMIT 0,3
    // 	`,
    //   { raw: true }
    // );

    const posts = await Note.findAll({
      attributes: {
        include: ['title', 'id'],
      },
      order: [['updatedAt', 'DESC']],
      limit: 3,
      include: {
        model: User,
        attributes: {
          include: ['avatar', 'userName'],
        },
      },
    });

    return posts;
  }

  /**
   * 按点赞数目降序排序
   */
  static async showLikedNotes() {
    let notes = await db.query(
      `
			SELECT u.user_name, u.avatar, n.*
			FROM note n 
			LEFT JOIN user u ON n.author = u.id
			order by n.like_num DESC
			`,
      { raw: true }
    );
    notes = this.common(notes);
    return notes;
  }

  /**
   * 按收藏数目降序排序
   */
  static async showCollectedNotes() {
    let notes = await db.query(
      `
			SELECT u.user_name, u.avatar, n.*
			FROM note n 
			LEFT JOIN user u ON n.author = u.id
			order by n.collect_num DESC
			`,
      { raw: true }
    );
    notes = this.common(notes);
    return notes;
  }

  /**
   * 按标题搜索文章（模糊查询），按更新时间降序排序
   * @param title
   */
  static async queryNoteByTitle(title) {
    let notes = await db.query(
      `
			SELECT u.user_name, u.avatar, n.*
			FROM note n 
			LEFT JOIN user u ON n.author = u.id
			WHERE n.title LIKE '%${title}%'
			order by n.created_at DESC
			`,
      { raw: true }
    );
    notes = this.common(notes);
    return notes;
  }

  /**
   * 查询用户所有文章，降序排序
   * @param id 用户ID
   */
  static async queryNoteByAuthor(id) {
    const posts = await Note.findAll({
      where: {
        author: id,
      },
      order: [['createdAt', 'DESC']],
      include: [User],
    });

    return posts;
  }

  /**
   * 查询文章详情
   * @param id
   */
  static async queryNoteById(id) {
    const post = await Note.findByPk(id, {
      attributes: {
        exclude: ['updatedAt', 'deletedAt'],
      },
      include: [
        {
          model: Tag,
          attributes: ['id', 'name'],
        },
        { model: User, attributes: ['userName', 'avatar'] },
      ],
    });

    // const authorInfo = await User.findByPk(post.author, {
    //   raw: true,
    //   attributes: ['userName', 'avatar'],
    // });

    return post.get({ plain: true });
  }

  /**
   * 文章的删除操作，同时通过事务删除点赞收藏表中的数据
   * @param id 用户ID
   */
  static async deleteNote(id) {
    const note = await Note.findByPk(id);
    if (!note) {
      throw new global.errs.NotFound('Note is not found!');
    }
    // 局部引用、防止循环引用
    const { Favor } = require('../models/favor');

    db.transaction(async (t) => {
      await note.destroy({
        force: true,
        transaction: t,
      });
      return await Favor.destroy({
        where: {
          artId: id,
        },
        force: true,
        transaction: t,
      });
    });
  }

  /**
   * 申请编辑文章方法
   * @param noteId 需要编辑的文章id
   * @param id 当前登陆用户id
   * 返回笔记的raw
   */
  static async modifyNote(noteId, id) {
    const content = await Note.findByPk(noteId, {
      attributes: { exclude: ['html'] },
      raw: true,
    });
    if (!content) {
      throw new global.errs.NotFound('文章不存在');
    } else if (content.author !== id) {
      throw new global.errs.NoteError('这不是您的文章');
    }
    return content;
  }

  /**
   * 更新文章
   * @param note 文章实体
   */
  static async updateNote(note) {
    const oldNote = Note.findByPk(note.id);
    if (!oldNote) {
      throw new global.errs.NotFound();
    }
    console.dir(note)
    await Note.update(
      {
        ...note,
      },
      {
        where: {
          id: note.id,
        },
      }
    );
  }

  /**
   * 判断文章是否被当前用户点赞
   * @param uid 当前登录用户
   * @param noteId 文章id
   */
  static async isLike(uid, noteId) {
    const { Favor } = require('../models/favor');
    let like = await Favor.findOne({
      where: {
        uid: uid,
        artId: noteId,
        type: 1,
      },
    });

    return !!like;
  }

  /**
   * 判断文章是否被当前用户收藏
   * @param uid 当前登录用户
   * @param noteId 文章id
   */
  static async isCollect(uid, noteId) {
    const { Favor } = require('../models/favor');
    let collect = await Favor.findOne({
      where: {
        uid: uid,
        artId: noteId,
        type: 2,
      },
    });

    return !!collect;
  }

  /**
   * 根据标签获取文章
   * @param tag
   */
  static async queryNoteByTag(id) {
    const thisTag = await Tag.findByPk(id);
    const name = thisTag.name;
    const isThisTag = await Tag.findAll({
      where: {
        name,
      },
      include: {
        model: Note,
      },
    });

    const data = isThisTag.map((tag) => tag.Note);

    return data;
  }

  /**
   * 获取文章视图公共方法
   * @param notes
   */
  static async common(notes) {
    return notes;
  }
}

Note.init(
  {
    // 记录ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 标题
    title: DataTypes.STRING(255),
    // 文章封面
    cover: DataTypes.STRING(255),
    blocks: {
      type: DataTypes.TEXT,
      set(value) {
        this.setDataValue('blocks', JSON.stringify(value));
      },
    },
    // 点赞数量
    likeNum: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // 收藏数量
    collectNum: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // 所处状态
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, //处于草稿状态
    },
  },
  {
    sequelize: db,
    tableName: 'note',
    paranoid: true,
  }
);

module.exports = { Note };
