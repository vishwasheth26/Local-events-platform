'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, { foreignKey: 'organizerId', as: 'organizer' });
      Group.belongsToMany(models.User, { through: models.GroupMember, as: 'members', foreignKey: 'groupId', otherKey: 'userId' });
    }
  }
  Group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
