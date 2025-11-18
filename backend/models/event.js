export default (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      location: DataTypes.STRING,
      event_date: DataTypes.DATE,
      createdBy: DataTypes.INTEGER
    }
  );

  Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });

    // MANY TO MANY — Interests
    Event.belongsToMany(models.Interest, {
      through: "EventInterests",
      as: "Interests",
      foreignKey: "eventId"
    });

    // ONE TO MANY — RSVP
    Event.hasMany(models.RSVP, {
      foreignKey: "eventId",
      as: "rsvps"
    });
  };

  return Event;
};
