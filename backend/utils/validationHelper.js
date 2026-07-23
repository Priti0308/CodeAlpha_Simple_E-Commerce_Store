const mongoose = require('mongoose');

/**
 * Validates email format using regular expressions
 * @param {String} email
 * @returns {Boolean}
 */
const isValidEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates password strength:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param {String} password
 * @returns {Boolean}
 */
const isStrongPassword = (password) => {
  if (!password || password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password); // Special character

  return hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
};

/**
 * Checks if a string is a valid MongoDB ObjectId
 * @param {String} id
 * @returns {Boolean}
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Check if value is a positive number (> 0)
 * @param {any} val
 * @returns {Boolean}
 */
const isPositiveNumber = (val) => {
  const num = Number(val);
  return !isNaN(num) && num > 0;
};

/**
 * Check if value is a non-negative number (>= 0)
 * @param {any} val
 * @returns {Boolean}
 */
const isNonNegativeNumber = (val) => {
  const num = Number(val);
  return !isNaN(num) && num >= 0;
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidObjectId,
  isPositiveNumber,
  isNonNegativeNumber,
};
