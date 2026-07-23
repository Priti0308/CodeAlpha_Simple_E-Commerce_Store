const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  validateOrderInput,
  validateIdParam,
} = require('../middleware/validationMiddleware');

router.route('/')
  .post(protect, validateOrderInput, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, validateIdParam('id'), getOrderById);
router.route('/:id/pay').put(protect, validateIdParam('id'), updateOrderToPaid);

module.exports = router;
