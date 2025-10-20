const express = require('express');
const axios = require('axios');

const router = express.Router();

// Service URLs from environment or defaults
const GUIDE_SERVICE_URL = process.env.GUIDE_SERVICE_URL || 'http://localhost:3005';

/**
 * GET / - Get featured guides
 * Proxies to guide-service featured guides endpoint
 */
router.get('/', async (req, res, next) => {
  try {
    // Forward all query parameters
    const queryParams = new URLSearchParams(req.query).toString();
    const url = `${GUIDE_SERVICE_URL}/featuredguides${queryParams ? `?${queryParams}` : ''}`;
    
    // Get authorization token from request if available
    const authHeader = req.headers.authorization;
    const headers = authHeader ? { Authorization: authHeader } : {};

    const response = await axios.get(url, { headers, validateStatus: () => true });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error fetching featured guides:', error.message);
    next(error);
  }
});

module.exports = router;

