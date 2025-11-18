export default (sequelize, DataTypes) => {
  const RSVP = sequelize.define(
    "RSVP",
    {
      status: { type: DataTypes.STRING, defaultValue: "going" },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      eventId: { type: DataTypes.INTEGER, allowNull: false }
    }
  );

  RSVP.associate = (models) => {
    RSVP.belongsTo(models.Event, { foreignKey: "eventId", as: "event" });
    RSVP.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return RSVP;
};
