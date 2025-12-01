'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
      User.belongsToMany(models.Event, { through: models.RSVP, as: 'attendedEvents', foreignKey: 'userId' });
      User.hasMany(models.Group, { foreignKey: 'organizerId', as: 'organizedGroups' });
      User.belongsToMany(models.Group, { through: models.GroupMember, as: 'joinedGroups', foreignKey: 'userId', otherKey: 'groupId' });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user' // user, organizer, admin
    },
    interests: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certifications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    linkedInConnected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('passwordHash')) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      }
    }
  });
  return User;
};
