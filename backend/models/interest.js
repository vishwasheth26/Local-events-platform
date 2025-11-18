export default (sequelize, DataTypes) => {
  const Interest = sequelize.define("Interest", {
    name: DataTypes.STRING
  });

  Interest.associate = (models) => {
    Interest.belongsToMany(models.User, {
      through: "UserInterests",
      foreignKey: "interestId",
    });

    Interest.belongsToMany(models.Event, {
      through: "EventInterests",
      as: "events",
      foreignKey: "interestId",
    });
  };

  return Interest;
};
