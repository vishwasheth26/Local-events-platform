'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.User, { foreignKey: 'organizerId', as: 'organizer' });
      Event.belongsToMany(models.User, { through: models.RSVP, as: 'attendees', foreignKey: 'eventId' });
    }
  }
  Event.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    category: {
      type: DataTypes.STRING
    },
    maxAttendees: {
      type: DataTypes.INTEGER
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
