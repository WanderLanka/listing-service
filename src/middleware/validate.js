const { ApiError } = require('./errorHandler');

const validate = (schema, property = 'query') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      return next(new ApiError(400, 'Validation failed', error.details.map(d => ({ message: d.message, path: d.path }))));
    }
    req[property] = value;
    return next();
  };
};

module.exports = validate;
