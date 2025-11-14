// backend/src/models/index.js
import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import defineUser from './user.js';
import defineEvent from './event.js';
import defineRSVP from './rsvp.js';

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = defineUser(sequelize, Sequelize.DataTypes);
db.Event = defineEvent(sequelize, Sequelize.DataTypes);
db.RSVP = defineRSVP(sequelize, Sequelize.DataTypes);

// relations
db.User.hasMany(db.Event, { foreignKey: 'creatorId', onDelete: 'CASCADE' });
db.Event.belongsTo(db.User, { foreignKey: 'creatorId' });

db.User.belongsToMany(db.Event, { through: db.RSVP, foreignKey: 'userId', otherKey: 'eventId' });
db.Event.belongsToMany(db.User, { through: db.RSVP, foreignKey: 'eventId', otherKey: 'userId' });

db.RSVP.belongsTo(db.User, { foreignKey: 'userId' });
db.RSVP.belongsTo(db.Event, { foreignKey: 'eventId' });

export default db;
