// migrations/YYYYMMDDHHmmss-create-groups.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Groups", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
    category: { type: Sequelize.STRING, allowNull: true },
    image: { type: Sequelize.STRING, allowNull: true },
    location: { type: Sequelize.STRING, allowNull: true },
    createdBy: { type: Sequelize.INTEGER, allowNull: true, references: { model: "Users", key: "id" } },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
  });
}

export async function down(queryInterface /*, Sequelize */) {
  await queryInterface.dropTable("Groups");
}
