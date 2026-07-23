const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  validateProductInput,
  validateIdParam,
} = require('../middleware/validationMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, validateProductInput, createProduct);

router.route('/:id')
  .get(validateIdParam('id'), getProductById)
  .put(protect, admin, validateIdParam('id'), validateProductInput, updateProduct)
  .delete(protect, admin, validateIdParam('id'), deleteProduct);

module.exports = router;
