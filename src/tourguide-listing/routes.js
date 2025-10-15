const express = require('express');
const allGuides = require('./allguides');
const guide = require('./guide');

// Back-compat shim: mounts previous routes under a single router
const router = express.Router();

router.use('/', allGuides);
router.use('/', guide);

module.exports = router;
