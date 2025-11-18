// backend/models/group.js
export default (sequelize, DataTypes) => {
  const Group = sequelize.define("Group", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    image: DataTypes.STRING,
    location: DataTypes.STRING,
    createdBy: DataTypes.INTEGER
  }, {});

  Group.associate = (models) => {
    Group.hasMany(models.GroupDiscussion, { foreignKey: "groupId" });
  };

  return Group;
};
