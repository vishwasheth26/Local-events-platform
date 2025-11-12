// backend/src/models/index.js
import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import defineUser from './user.js';

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = defineUser(sequelize, Sequelize.DataTypes);

export default db;
