require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./src/config');
const { connectDB } = require('./src/config/database');
const logger = require('./src/utils/logger');
// New structured routers
const allGuidesRouter = require('./src/tourguide-listing/allguides');
const guideRouter = require('./src/tourguide-listing/guide');
const featuredGuidesRouter = require('./src/tourguide-listing/featuredguides');
const { errorConverter, errorHandler, notFound } = require('./src/middleware/errorHandler');

const app = express();

app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'listing-service', timestamp: new Date().toISOString() });
});

// New structured mount points
app.use('/tourguide-listing/allguides', allGuidesRouter);
app.use('/service/tourguide-listing/guide', guideRouter);
app.use('/service/tourguide-listing/featuredguides', featuredGuidesRouter);

// Backwards compatibility (old endpoints)
app.use('/guides', allGuidesRouter);

app.use(notFound);
app.use(errorConverter);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(config.port, () => logger.info(`🚀 Listing service listening on port ${config.port}`));
});
