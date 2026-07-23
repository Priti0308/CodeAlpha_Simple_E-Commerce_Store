const Cart = require('../models/Cart');
const { sendSuccess } = require('../utils/responseHelper');

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    sendSuccess(res, 'Cart fetched successfully', cart, 200);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart items (add, update quantity, remove)
// @route   POST /api/cart
// @access  Private
const updateCart = async (req, res, next) => {
  const { items } = req.body; // Array of { product, quantity }

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    cart.items = items;
    const updatedCart = await cart.save();
    
    // Populate product details before returning
    const populatedCart = await updatedCart.populate('items.product');
    sendSuccess(res, 'Cart updated successfully', populatedCart, 200);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    
    sendSuccess(res, 'Cart cleared successfully', null, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  updateCart,
  clearCart,
};
