const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegisterInput,
  validateLoginInput,
  validateProfileUpdateInput,
} = require('../middleware/validationMiddleware');

router.post('/login', validateLoginInput, authUser);
router.post('/register', validateRegisterInput, registerUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validateProfileUpdateInput, updateUserProfile);

module.exports = router;
