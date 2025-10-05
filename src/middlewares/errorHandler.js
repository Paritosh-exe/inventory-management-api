const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }
  
    if (err.name === 'CastError') {
      const message = 'Invalid ID format';
      error.statusCode = 400;
      error.message = message;
    }
  
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error.statusCode = 400;
      error.message = message;
    }
  
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error.statusCode = 400;
      error.message = message;
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
  
  module.exports = errorHandler;