export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Events", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      location: { type: Sequelize.STRING, allowNull: false },
      event_date: { type: Sequelize.DATE, allowNull: false },
      
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addIndex("Events", ["createdBy"]);
    await queryInterface.addIndex("Events", ["event_date"]);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("Events", ["createdBy"]);
    await queryInterface.removeIndex("Events", ["event_date"]);
    await queryInterface.dropTable("Events");
  },
};
