export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("EventInterests", {
    eventId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Events", key: "id" },
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

  await queryInterface.addIndex("EventInterests", ["eventId"]);
  await queryInterface.addIndex("EventInterests", ["interestId"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("EventInterests");
}
