const { validationResult } = require('express-validator');

const validateRequest = (validations) => {
  return async (req, res, next) => {
    
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: extractedErrors
    });
  };
};

module.exports = validateRequest;