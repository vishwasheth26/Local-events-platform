// backend/src/models/event.js
export default function defineEvent(sequelize, DataTypes) {
  const Event = sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE, allowNull: false },
    capacity: { type: DataTypes.INTEGER, defaultValue: 100 },
    creatorId: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'events' });

  return Event;
}
