const express = require('express');
const router = express.Router();
const {
  getCart,
  updateCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { validateCartInput } = require('../middleware/validationMiddleware');

router.route('/')
  .get(protect, getCart)
  .post(protect, validateCartInput, updateCart)
  .delete(protect, clearCart);

module.exports = router;
