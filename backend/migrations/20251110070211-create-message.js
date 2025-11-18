export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Messages", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Events", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      text: { type: Sequelize.TEXT, allowNull: false },

      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addIndex("Messages", ["eventId"]);
    await queryInterface.addIndex("Messages", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("Messages", ["userId"]);
    await queryInterface.removeIndex("Messages", ["eventId"]);
    await queryInterface.dropTable("Messages");
  },
};
