// migrations/YYYYMMDDHHmmss-create-group-discussions.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("GroupDiscussions", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    groupId: { 
      type: Sequelize.INTEGER, allowNull: false,
      references: { model: "Groups", key: "id" }, onDelete: "CASCADE"
    },
    userId: { 
      type: Sequelize.INTEGER, allowNull: false,
      references: { model: "Users", key: "id" }, onDelete: "CASCADE"
    },
    title: { type: Sequelize.STRING, allowNull: false },
    content: { type: Sequelize.TEXT, allowNull: false },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
  });

  await queryInterface.addIndex("GroupDiscussions", ["groupId"]);
  await queryInterface.addIndex("GroupDiscussions", ["userId"]);
}

export async function down(queryInterface /*, Sequelize */) {
  await queryInterface.dropTable("GroupDiscussions");
}
