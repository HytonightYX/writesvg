const { User } = require('./app/models/user');
const { Note } = require('./app/models/note');
const { Tag } = require('./app/models/tag');

Note.hasMany(Tag);
Tag.belongsTo(Note);

User.hasMany(Note, { foreignKey: 'author' });
Note.belongsTo(User, { foreignKey: 'author' });
