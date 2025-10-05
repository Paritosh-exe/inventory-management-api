const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

class ProductService {
  // Create a new product
  async createProduct(productData) {
    const product = await Product.create(productData);
    return product;
  }

  // Get all products
  async getAllProducts() {
    const products = await Product.find().sort({ createdAt: -1 });
    return products;
  }

  // Get product by ID
  async getProductById(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  // Update product
  async updateProduct(productId, updateData) {
    // Validate stock_quantity if provided
    if (updateData.stock_quantity !== undefined && updateData.stock_quantity < 0) {
      throw new ApiError(400, 'Stock quantity cannot be negative');
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return product;
  }

  // Delete product
  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  // Add stock to product
  async addStock(productId, quantity) {
    if (!quantity || quantity <= 0) {
      throw new ApiError(400, 'Quantity must be a positive number');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    product.stock_quantity += quantity;
    await product.save();

    return product;
  }

  // Remove stock from product
  async removeStock(productId, quantity) {
    if (!quantity || quantity <= 0) {
      throw new ApiError(400, 'Quantity must be a positive number');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Check if sufficient stock is available
    if (product.stock_quantity < quantity) {
      throw new ApiError(
        400,
        `Insufficient stock. Available: ${product.stock_quantity}, Requested: ${quantity}`
      );
    }

    product.stock_quantity -= quantity;
    await product.save();

    return product;
  }

  // Get products with low stock
  async getLowStockProducts() {
    const products = await Product.find({
      $expr: { $lte: ['$stock_quantity', '$low_stock_threshold'] }
    }).sort({ stock_quantity: 1 });

    return products;
  }
}

module.exports = new ProductService();