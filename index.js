require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./src/config');
const { connectDB } = require('./src/config/database');
const logger = require('./src/utils/logger');
const guidesRouter = require('./src/tourguide-listing');
const { errorConverter, errorHandler, notFound } = require('./src/middleware/errorHandler');

const app = express();

app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'listing-service', timestamp: new Date().toISOString() });
});

app.use('/guides', guidesRouter);

app.use(notFound);
app.use(errorConverter);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(config.port, () => logger.info(`🚀 Listing service listening on port ${config.port}`));
});
