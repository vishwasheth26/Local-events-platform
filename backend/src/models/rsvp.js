'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RSVP extends Model {
    static associate(models) {
      // define association here
    }
  }
  RSVP.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('going', 'interested', 'not_going'),
      defaultValue: 'going'
    }
  }, {
    sequelize,
    modelName: 'RSVP',
  });
  return RSVP;
};
