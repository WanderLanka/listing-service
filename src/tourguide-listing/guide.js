const express = require('express');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

// Service URLs from environment or defaults
const GUIDE_SERVICE_URL = process.env.GUIDE_SERVICE_URL || 'http://localhost:3005';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

/**
 * GET /:idOrUsername - Get combined guide profile from guide-service and user-service
 * This endpoint combines data from both services to provide a complete profile
 * Can search by: userId (as query param), guide _id, or username
 */
router.get('/:idOrUsername', async (req, res, next) => {
  try {
    const { idOrUsername } = req.params;
    const { userId } = req.query;
    
    // Get authorization token from request if available
    const authHeader = req.headers.authorization;
    const headers = authHeader ? { Authorization: authHeader } : {};

    // Build URL based on whether we have userId or idOrUsername
    let guideUrl;
    if (userId) {
      // Search by userId query parameter
      guideUrl = `${GUIDE_SERVICE_URL}/guide/get?userId=${encodeURIComponent(userId)}`;
    } else {
      // Search by id or username in path
      guideUrl = `${GUIDE_SERVICE_URL}/guide/get/${encodeURIComponent(idOrUsername)}`;
    }

    // Fetch guide data from guide-service
    const guideResponse = await axios.get(guideUrl, { headers, validateStatus: () => true });

    if (guideResponse.status !== 200 || !guideResponse.data?.success) {
      return res.status(guideResponse.status || 404).json({
        success: false,
        error: guideResponse.data?.error || 'Guide not found',
      });
    }

    const guideData = guideResponse.data.data;
    
    // Fetch user data (email) from user-service for the CURRENT user via /api/auth/profile
    let userData = null;
    try {
      const userResponse = await axios.get(
        `${USER_SERVICE_URL}/api/auth/profile`,
        { headers, validateStatus: () => true }
      );
      
      if (userResponse.status === 200 && userResponse.data?.data?.user) {
        userData = userResponse.data.data.user;
      }
    } catch (userError) {
      console.error('Failed to fetch user profile for email:', userError.message);
      // Continue without user data if it fails
    }

    // Combine the data
    const combinedProfile = {
      ...guideData,
      email: userData?.email || null,
      emailVerified: userData?.emailVerified || false,
      phone: userData?.phone || null,
      createdAt: guideData.createdAt || userData?.createdAt || null,
      updatedAt: guideData.updatedAt || userData?.updatedAt || null,
    };

    return res.json({
      success: true,
      data: combinedProfile,
    });
  } catch (error) {
    console.error('Error fetching combined guide profile:', error.message);
    next(error);
  }
});

/**
 * GET /me?userId=... - Convenience endpoint to get current guide by userId
 */
router.get('/me', async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const authHeader = req.headers.authorization;
    const headers = authHeader ? { Authorization: authHeader } : {};

    const guideUrl = `${GUIDE_SERVICE_URL}/guide/get?userId=${encodeURIComponent(userId)}`;
    const guideResponse = await axios.get(guideUrl, { headers, validateStatus: () => true });

    if (guideResponse.status !== 200 || !guideResponse.data?.success) {
      return res.status(guideResponse.status || 404).json({
        success: false,
        error: guideResponse.data?.error || 'Guide not found',
      });
    }

    const guideData = guideResponse.data.data;

    // Fetch user data (email) from user-service for the CURRENT user via /api/auth/profile
    // This relies on the Authorization header and returns the logged-in user's info
    let userData = null;
    try {
      const userResponse = await axios.get(
        `${USER_SERVICE_URL}/api/auth/profile`,
        { headers, validateStatus: () => true }
      );
      if (userResponse.status === 200 && userResponse.data?.data?.user) {
        userData = userResponse.data.data.user;
      }
    } catch (err) {
      console.error('Failed to fetch user profile for email:', err.message);
    }

    const combinedProfile = {
      ...guideData,
      email: userData?.email || null,
      emailVerified: userData?.emailVerified || false,
      phone: userData?.phone || null,
      createdAt: guideData.createdAt || userData?.createdAt || null,
      updatedAt: guideData.updatedAt || userData?.updatedAt || null,
    };

    return res.json({ success: true, data: combinedProfile });
  } catch (error) {
    console.error('Error fetching current guide profile:', error.message);
    next(error);
  }
});

module.exports = router;

