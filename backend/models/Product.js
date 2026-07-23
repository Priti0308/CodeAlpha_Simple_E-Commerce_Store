const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please add an image path/url'],
      default: '/uploads/placeholder.jpg',
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0.0,
      min: [0.01, 'Price must be greater than 0'],
    },
    countInStock: {
      type: Number,
      required: [true, 'Please add count in stock'],
      default: 0,
      min: [0, 'Stock count cannot be negative'],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Number of reviews cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
