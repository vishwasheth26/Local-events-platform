const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');

const app = express();
// Force restart 5
// Force restart 4

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/groups', groupRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/payments', require('./routes/paymentRoutes'));
app.get('/', (req, res) => {
  res.send('Evinza Backend is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
