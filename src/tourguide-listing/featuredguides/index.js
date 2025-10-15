const express = require('express');
const User = require('../../models/User');

const router = express.Router();

// GET /service/tourguide-listing/featuredguides
// Returns a small list of featured guides (e.g., flagged in DB or top recent)
router.get('/', async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    const status = req.query.status || 'active';

    const filter = { role: 'guide', status };

    // Prefer explicit featured flag if present in schema, otherwise fallback to sorting heuristic
    const projection = {
      username: 1,
      avatar: 1,
      role: 1,
      status: 1,
      'guideDetails.firstName': 1,
      'guideDetails.lastName': 1,
      'guideDetails.featured': 1,
      'guideDetails.rating': 1,
    };

    let items = await User.find({ ...filter, 'guideDetails.featured': true }, projection)
      .sort({ 'guideDetails.rating': -1 })
      .limit(limit)
      .lean();

    // If there's no explicit featured flag, or too few results, fallback to top-rated active guides
    if (!items || items.length < Math.min(3, limit)) {
      const remaining = limit - (items ? items.length : 0);
      const fallback = await User.find(filter, projection)
        .sort({ 'guideDetails.rating': -1, 'guideDetails.firstName': 1 })
        .limit(remaining > 0 ? remaining : 0)
        .lean();
      items = [...(items || []), ...fallback];
    }

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
