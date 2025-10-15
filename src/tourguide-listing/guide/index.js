const express = require('express');
const User = require('../../models/User');

const router = express.Router();

// GET /service/tourguide-listing/guide/:username
router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { status } = req.query;

    if (!username) {
      return res.status(400).json({ success: false, error: 'username is required' });
    }

    const filter = { role: 'guide', username };
    filter.status = status || 'active';

    const projection = {
      username: 1,
      avatar: 1,
      role: 1,
      status: 1,
      'guideDetails.firstName': 1,
      'guideDetails.lastName': 1,
      'guideDetails.bio': 1,
      'guideDetails.languages': 1,
    };

    const item = await User.findOne(filter, projection).lean();
    if (!item) {
      return res.status(404).json({ success: false, error: 'Guide not found' });
    }

    return res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
