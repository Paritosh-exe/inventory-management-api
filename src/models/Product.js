const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    stock_quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0
    },
    low_stock_threshold: {
      type: Number,
      default: 10,
      min: [0, 'Low stock threshold cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual('is_low_stock').get(function() {
  return this.stock_quantity <= this.low_stock_threshold;
});

productSchema.index({ name: 1 });
productSchema.index({ stock_quantity: 1 });

module.exports = mongoose.model('Product', productSchema);