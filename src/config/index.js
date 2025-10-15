const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3010,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/wanderlanka',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
};

module.exports = config;
