require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

const http = require('http');
const { initSocket } = require('./socket');

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    console.log('Syncing database...');
    await sequelize.sync({ alter: true }); // Update tables if needed
    console.log('Database synced.');
    
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
