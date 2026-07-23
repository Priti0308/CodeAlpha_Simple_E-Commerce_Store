const { sendError } = require('../utils/responseHelper');
const {
  isValidEmail,
  isStrongPassword,
  isValidObjectId,
  isPositiveNumber,
  isNonNegativeNumber,
} = require('../utils/validationHelper');

/**
 * Validate MongoDB ID parameters (e.g. /products/:id)
 */
const validateIdParam = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !isValidObjectId(id)) {
      return sendError(res, 'Invalid request parameter', [`The field ${paramName} must be a valid ObjectId`], 400);
    }
    next();
  };
};

/**
 * Validate user registration details
 */
const validateRegisterInput = (req, res, next) => {
  let { name, email, password } = req.body;

  // Trim values
  name = name ? name.trim() : '';
  email = email ? email.trim() : '';
  
  req.body.name = name;
  req.body.email = email;

  const errors = [];

  if (!name) errors.push('Name field is required');
  if (!email) {
    errors.push('Email field is required');
  } else if (!isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password) {
    errors.push('Password field is required');
  } else if (!isStrongPassword(password)) {
    errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  }

  if (errors.length > 0) {
    return sendError(res, 'Registration validation failed', errors, 400);
  }

  next();
};

/**
 * Validate user login credentials
 */
const validateLoginInput = (req, res, next) => {
  let { email, password } = req.body;

  email = email ? email.trim() : '';
  req.body.email = email;

  const errors = [];

  if (!email) {
    errors.push('Email field is required');
  } else if (!isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password) {
    errors.push('Password field is required');
  }

  if (errors.length > 0) {
    return sendError(res, 'Login validation failed', errors, 400);
  }

  next();
};

/**
 * Validate product creation or modification inputs
 */
const validateProductInput = (req, res, next) => {
  let { name, price, description, category, countInStock } = req.body;

  name = name ? name.trim() : '';
  description = description ? description.trim() : '';
  category = category ? category.trim() : '';

  req.body.name = name;
  req.body.description = description;
  req.body.category = category;

  const errors = [];

  if (!name) errors.push('Product name is required');
  if (!description) errors.push('Product description is required');
  if (!category) errors.push('Category is required');
  
  if (price === undefined || price === null) {
    errors.push('Price is required');
  } else if (!isPositiveNumber(price)) {
    errors.push('Price must be a positive number greater than 0');
  }

  if (countInStock === undefined || countInStock === null) {
    errors.push('Count in stock is required');
  } else if (!isNonNegativeNumber(countInStock)) {
    errors.push('Count in stock must be a non-negative integer');
  }

  if (errors.length > 0) {
    return sendError(res, 'Product validation failed', errors, 400);
  }

  next();
};

/**
 * Validate order placement details
 */
const validateOrderInput = (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  const errors = [];

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    errors.push('Order items must be a non-empty array');
  } else {
    orderItems.forEach((item, idx) => {
      if (!item.name) errors.push(`Item at index ${idx} is missing a name`);
      if (!item.product || !isValidObjectId(item.product)) {
        errors.push(`Item at index ${idx} must contain a valid product ObjectId`);
      }
      if (item.qty === undefined || item.qty === null || !isPositiveNumber(item.qty)) {
        errors.push(`Item at index ${idx} qty must be a positive integer`);
      }
      if (item.price === undefined || item.price === null || !isNonNegativeNumber(item.price)) {
        errors.push(`Item at index ${idx} price must be a non-negative number`);
      }
    });
  }

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    errors.push('Shipping address details object is required');
  } else {
    const { address, city, postalCode, country } = shippingAddress;
    if (!address || !address.trim()) errors.push('Shipping street address is required');
    if (!city || !city.trim()) errors.push('Shipping city is required');
    if (!postalCode || !postalCode.trim()) errors.push('Shipping postal code is required');
    if (!country || !country.trim()) errors.push('Shipping country is required');
  }

  if (!paymentMethod) {
    errors.push('Payment method is required');
  }

  if (errors.length > 0) {
    return sendError(res, 'Order validation failed', errors, 400);
  }

  next();
};

/**
 * Validate user profile update details (password optional)
 */
const validateProfileUpdateInput = (req, res, next) => {
  let { name, email, password } = req.body;

  name = name ? name.trim() : '';
  email = email ? email.trim() : '';

  req.body.name = name;
  req.body.email = email;

  const errors = [];

  if (name === '') errors.push('Name field cannot be empty');
  if (email === '') {
    errors.push('Email field cannot be empty');
  } else if (!isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (password && !isStrongPassword(password)) {
    errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  }

  if (errors.length > 0) {
    return sendError(res, 'Profile update validation failed', errors, 400);
  }

  next();
};

/**
 * Validate shopping cart update inputs
 */
const validateCartInput = (req, res, next) => {
  const { items } = req.body;
  const errors = [];

  if (items && !Array.isArray(items)) {
    errors.push('Cart items must be an array');
  } else if (items) {
    items.forEach((item, idx) => {
      if (!item.product || !isValidObjectId(item.product)) {
        errors.push(`Item at index ${idx} must contain a valid product ObjectId`);
      }
      if (item.quantity === undefined || item.quantity === null || !isPositiveNumber(item.quantity)) {
        errors.push(`Item at index ${idx} quantity must be a positive integer`);
      }
    });
  }

  if (errors.length > 0) {
    return sendError(res, 'Cart validation failed', errors, 400);
  }

  next();
};

module.exports = {
  validateIdParam,
  validateRegisterInput,
  validateLoginInput,
  validateProductInput,
  validateOrderInput,
  validateProfileUpdateInput,
  validateCartInput,
};
