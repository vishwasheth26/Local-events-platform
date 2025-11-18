// backend/models/discussionComment.js
export default (sequelize, DataTypes) => {
  const DiscussionComment = sequelize.define("DiscussionComment", {
    discussionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {});

  DiscussionComment.associate = (models) => {
    DiscussionComment.belongsTo(models.GroupDiscussion, { foreignKey: "discussionId" });
    DiscussionComment.belongsTo(models.User, { as: "author", foreignKey: "userId" });
  };

  return DiscussionComment;
};
