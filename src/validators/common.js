const Joi = require('joi');

const pagination = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const search = Joi.string().min(1).max(100);

module.exports = { pagination, search };
