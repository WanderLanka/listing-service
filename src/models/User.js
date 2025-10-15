const mongoose = require('mongoose');

// Minimal User model for listing purposes. If you share a DB, keep the same collection name.
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });

module.exports = mongoose.model('User', userSchema);
