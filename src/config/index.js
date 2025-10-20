const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3010,
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://abdulraheempsn:0769634145aB@cluster0.xuwqh3p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
};

module.exports = config;
