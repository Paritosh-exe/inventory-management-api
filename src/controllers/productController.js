const asyncHandler = require('express-async-handler');
const productService = require('../services/productService');

// @desc    Create new product
// @route   POST /api/products
// @access  Public
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Add stock to product
// @route   PATCH /api/products/:id/add-stock
// @access  Public
exports.addStock = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const product = await productService.addStock(req.params.id, quantity);
  res.status(200).json({
    success: true,
    message: `Added ${quantity} units to stock`,
    data: product
  });
});

// @desc    Remove stock from product
// @route   PATCH /api/products/:id/remove-stock
// @access  Public
exports.removeStock = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const product = await productService.removeStock(req.params.id, quantity);
  res.status(200).json({
    success: true,
    message: `Removed ${quantity} units from stock`,
    data: product
  });
});

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Public
exports.getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await productService.getLowStockProducts();
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});