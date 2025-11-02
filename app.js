require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const startServer = async () => {
  await connectDB();

  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(cors());

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/workouts', require('./routes/workouts'));
  app.use('/api/nutrition', require('./routes/nutrition'));
  app.use('/api/progress', require('./routes/progress'));

  app.get('/', (req, res) => {
    res.json({ 
      message: 'Fitness Tracker API', 
      version: '1.0.0',
      status: 'Running'
    });
  });

  app.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`
    });
  });

  app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    console.log(`✅ API Base: http://localhost:${PORT}/api`);
  });
};

startServer().catch(err => {
  console.error('Failed to start:', err.message);
  process.exit(1);
});