const express = require('express');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { listGuidesQuery } = require('../validators/guideValidators');

const router = express.Router();

// GET /guides
// Supports pagination, search by first/last name, and approved filter
router.get('/', validate(listGuidesQuery), async (req, res, next) => {
  try {
    const { page, limit, q, status } = req.query;

    const filter = { role: 'guide' };

    // Filter by status; default to active when not provided
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'active';
    }

    // Basic search on first/last name (case-insensitive)
    if (q) {
      filter.$or = [
        { 'guideDetails.firstName': { $regex: q, $options: 'i' } },
        { 'guideDetails.lastName': { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const projection = {
      username: 1,
      avatar: 1,
      role: 1,
      status: 1,
      'guideDetails.firstName': 1,
      'guideDetails.lastName': 1,
    };

    const [items, total] = await Promise.all([
      User.find(filter, projection).sort({ 'guideDetails.firstName': 1, 'guideDetails.lastName': 1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
