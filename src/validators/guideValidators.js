const Joi = require('joi');
const { pagination, search } = require('./common');

const listGuidesQuery = pagination.keys({
  q: search.optional(),
  // Filter by status; defaults to 'active' when not provided
  status: Joi.string().valid('active', 'pending', 'inactive', 'rejected').optional(),
});

module.exports = { listGuidesQuery };
