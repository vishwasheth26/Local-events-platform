// migrations/YYYYMMDDHHmmss-create-discussion-comments.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("DiscussionComments", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    discussionId: {
      type: Sequelize.INTEGER, allowNull: false,
      references: { model: "GroupDiscussions", key: "id" }, onDelete: "CASCADE"
    },
    userId: {
      type: Sequelize.INTEGER, allowNull: false,
      references: { model: "Users", key: "id" }, onDelete: "CASCADE"
    },
    text: { type: Sequelize.TEXT, allowNull: false },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
  });

  await queryInterface.addIndex("DiscussionComments", ["discussionId"]);
  await queryInterface.addIndex("DiscussionComments", ["userId"]);
}

export async function down(queryInterface /*, Sequelize */) {
  await queryInterface.dropTable("DiscussionComments");
}
