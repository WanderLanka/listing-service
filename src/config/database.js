const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./index');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('✅ MongoDB connected');
  } catch (err) {
    logger.error('❌ MongoDB connection error', { message: err.message });
    process.exit(1);
  }
};

module.exports = { connectDB };
