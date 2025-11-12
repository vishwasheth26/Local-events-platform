// backend/src/index.js
import 'dotenv/config'; // loads .env
import app from './app.js';
import db from './models/index.js';

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected');
    // dev convenience — creates/updates tables. Remove in prod and use migrations.
    await db.sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
