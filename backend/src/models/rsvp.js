// backend/src/models/rsvp.js
export default function defineRSVP(sequelize, DataTypes) {
  const RSVP = sequelize.define('RSVP', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: {
      type: DataTypes.ENUM('going', 'interested', 'not_going'),
      allowNull: false,
      defaultValue: 'going'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    eventId: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'rsvps' });

  return RSVP;
}
