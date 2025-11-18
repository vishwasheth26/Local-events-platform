const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('localevents_db', 'postgres', 'admin', {
  host: '127.0.0.1',
  dialect: 'postgres'
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL successfully!');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await sequelize.close();
  }
})();
