import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Event, { foreignKey: "createdBy", as: "events" });
      User.hasMany(models.RSVP, { foreignKey: "userId", as: "rsvps" });
      User.hasMany(models.Message, { foreignKey: "userId", as: "messages" });

      User.belongsToMany(models.Interest, {
        through: "UserInterests",
        foreignKey: "userId",
        as: "interests",
      });
    }
  }

  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false, defaultValue: "user" },
      otpCode: { type: DataTypes.STRING },
      otpExpiry: { type: DataTypes.DATE },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      tempResetAllowed: { type: DataTypes.BOOLEAN, defaultValue: false },

    },
    { sequelize, modelName: "User" }
  );

  return User;
};
