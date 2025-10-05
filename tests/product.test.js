const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../src/models/Product');
const productService = require('../src/services/productService');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

describe('Product Service - Stock Management', () => {
  let testProduct;

  beforeEach(async () => {
    testProduct = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      stock_quantity: 100,
      low_stock_threshold: 20
    });
  });

  describe('addStock', () => {
    test('should add stock successfully', async () => {
      const result = await productService.addStock(testProduct._id, 50);
      expect(result.stock_quantity).toBe(150);
    });

    test('should throw error for negative quantity', async () => {
      await expect(
        productService.addStock(testProduct._id, -10)
      ).rejects.toThrow('Quantity must be a positive number');
    });

    test('should throw error for zero quantity', async () => {
      await expect(
        productService.addStock(testProduct._id, 0)
      ).rejects.toThrow('Quantity must be a positive number');
    });

    test('should throw error for invalid product ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(
        productService.addStock(fakeId, 10)
      ).rejects.toThrow('Product not found');
    });
  });

  describe('removeStock', () => {
    test('should remove stock successfully', async () => {
      const result = await productService.removeStock(testProduct._id, 30);
      expect(result.stock_quantity).toBe(70);
    });

    test('should throw error when removing more stock than available', async () => {
      await expect(
        productService.removeStock(testProduct._id, 150)
      ).rejects.toThrow('Insufficient stock');
    });

    test('should throw error for negative quantity', async () => {
      await expect(
        productService.removeStock(testProduct._id, -10)
      ).rejects.toThrow('Quantity must be a positive number');
    });

    test('should allow removing exact stock quantity', async () => {
      const result = await productService.removeStock(testProduct._id, 100);
      expect(result.stock_quantity).toBe(0);
    });

    test('should throw error when trying to remove from zero stock', async () => {
      await productService.removeStock(testProduct._id, 100);
      await expect(
        productService.removeStock(testProduct._id, 1)
      ).rejects.toThrow('Insufficient stock');
    });
  });

  describe('getLowStockProducts', () => {
    test('should return products below threshold', async () => {
      await Product.create({
        name: 'Low Stock Product',
        description: 'Test',
        stock_quantity: 5,
        low_stock_threshold: 10
      });

      const lowStockProducts = await productService.getLowStockProducts();
      expect(lowStockProducts.length).toBe(1);
      expect(lowStockProducts[0].name).toBe('Low Stock Product');
    });

    test('should not return products above threshold', async () => {
      const lowStockProducts = await productService.getLowStockProducts();
      expect(lowStockProducts.length).toBe(0);
    });

    test('should return products at threshold', async () => {
      await Product.create({
        name: 'At Threshold Product',
        description: 'Test',
        stock_quantity: 10,
        low_stock_threshold: 10
      });

      const lowStockProducts = await productService.getLowStockProducts();
      expect(lowStockProducts.length).toBe(1);
    });
  });

  describe('updateProduct - Stock Validation', () => {
    test('should prevent negative stock through update', async () => {
      await expect(
        productService.updateProduct(testProduct._id, { stock_quantity: -5 })
      ).rejects.toThrow('Stock quantity cannot be negative');
    });

    test('should allow updating stock to zero', async () => {
      const result = await productService.updateProduct(testProduct._id, { 
        stock_quantity: 0 
      });
      expect(result.stock_quantity).toBe(0);
    });
  });
});