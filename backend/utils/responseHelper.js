/**
 * Centralized API response format helpers
 */

/**
 * Send standard success response
 * @param {Object} res - Express response object
 * @param {String} message - Custom message
 * @param {Object|Array} data - Data to send back
 * @param {Number} statusCode - HTTP status code
 */
const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send standard error response
 * @param {Object} res - Express response object
 * @param {String} message - Main error summary message
 * @param {Array} errors - Array of detailed validations/messages
 * @param {Number} statusCode - HTTP status code
 */
const sendError = (res, message, errors = [], statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
