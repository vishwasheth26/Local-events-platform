// backend/src/models/index.js
import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import defineUser from './user.js';
import defineEvent from './event.js';   

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = defineUser(sequelize, Sequelize.DataTypes);
db.Event = defineEvent(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Event, { foreignKey: 'creatorId', onDelete: 'CASCADE' });
db.Event.belongsTo(db.User, { foreignKey: 'creatorId' });

export default db;
