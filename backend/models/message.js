import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Message.belongsTo(models.Event, { foreignKey: "eventId", as: "event" });
    }
  }

  Message.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      eventId: { type: DataTypes.INTEGER, allowNull: false },
      text: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: "Message",
    }
  );

  return Message;
};
