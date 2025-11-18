export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RSVPs", {
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

      status: { type: Sequelize.STRING, defaultValue: "going" },

      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("RSVPs", {
      fields: ["userId", "eventId"],
      type: "unique",
      name: "unique_user_event_rsvp",
    });

    await queryInterface.addIndex("RSVPs", ["userId"]);
    await queryInterface.addIndex("RSVPs", ["eventId"]);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("RSVPs", ["eventId"]);
    await queryInterface.removeIndex("RSVPs", ["userId"]);
    await queryInterface.removeConstraint("RSVPs", "unique_user_event_rsvp");
    await queryInterface.dropTable("RSVPs");
  },
};
