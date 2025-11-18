// backend/models/groupDiscussion.js
export default (sequelize, DataTypes) => {
  const GroupDiscussion = sequelize.define("GroupDiscussion", {
    groupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});

  GroupDiscussion.associate = (models) => {
    GroupDiscussion.belongsTo(models.Group, { foreignKey: "groupId" });
    GroupDiscussion.belongsTo(models.User, { as: "author", foreignKey: "userId" });
    GroupDiscussion.hasMany(models.DiscussionComment, { foreignKey: "discussionId" });
  };

  return GroupDiscussion;
};
