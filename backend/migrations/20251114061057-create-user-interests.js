export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("UserInterests", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    interestId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Interests", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
  });

  await queryInterface.addIndex("UserInterests", ["userId"]);
  await queryInterface.addIndex("UserInterests", ["interestId"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("UserInterests");
}
