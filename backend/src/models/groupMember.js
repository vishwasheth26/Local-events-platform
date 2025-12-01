'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
      // define association here
    }
  }
  GroupMember.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id'
      }
    },
    memberRole: {
      type: DataTypes.STRING,
      defaultValue: 'member',
      validate: {
        isIn: [['admin', 'member']]
      }
    }
  }, {
    sequelize,
    modelName: 'GroupMember',
  });
  return GroupMember;
};
