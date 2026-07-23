// 404 Route handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let errors = [];

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error occurred';
    errors = Object.values(err.errors).map(val => val.message);
  }
  
  // Mongoose duplicate key error (409 Conflict)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
    errors = [`${Object.keys(err.keyValue || {})} must be unique`];
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
    errors = [`Invalid format for field ${err.path}`];
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, invalid token';
    errors = ['Token signature verification failed'];
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token expired';
    errors = ['The token has expired, please log in again'];
  }

  // If status is 500, mask internal server details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
    errors = ['A server error occurred, please contact support'];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : [message],
  });
};

module.exports = { notFound, errorHandler };
