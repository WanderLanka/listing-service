const Joi = require('joi');
const { pagination, search } = require('./common');

const listGuidesQuery = pagination.keys({
  q: search.optional(),
  approved: Joi.boolean().optional(),
});

module.exports = { listGuidesQuery };
