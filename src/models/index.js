import { DataTypes, Sequelize } from 'sequelize';
import { DB, USER, PASSWORD, HOST, dialect as _dialect } from '../config/db.config.js';
import Group from './group.model.js';
import Like from './like.model.js';
import Message from './message.model.js';
import User from './user.model.js';


const sequelize = new Sequelize(DB, USER, PASSWORD, {
    host: HOST,
    dialect: _dialect,
    operatorsAliases: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Group = Group(sequelize, Sequelize);
db.Like = Like(sequelize, Sequelize);
db.Message = Message(sequelize, Sequelize);
db.User = User(sequelize, Sequelize);

db.Group.belongsTo(db.User, { as: 'groupAdmin' });
db.User.hasMany(db.Group, { as: 'groups', foreignKey: 'groupAdminId' });

db.User.belongsToMany(db.Group, { through: 'UserGroup' });
db.Group.belongsToMany(db.User, { through: 'UserGroup' });

db.User.hasMany(db.Message);
db.Message.belongsTo(db.User);

db.Group.hasMany(db.Message);
db.Message.belongsTo(db.Group);

db.Message.hasMany(db.Like);
db.Like.belongsTo(db.Message);

db.User.hasMany(db.Like);
db.Like.belongsTo(db.User);

export default db;