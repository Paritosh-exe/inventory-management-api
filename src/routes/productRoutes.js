const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addStock,
  removeStock,
  getLowStockProducts
} = require('../controllers/productController');
const validateRequest = require('../middlewares/validateRequest');
const {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  stockQuantityValidation
} = require('../validators/productValidator');


router.get('/low-stock', getLowStockProducts);


router.route('/')
  .get(getAllProducts)
  .post(validateRequest(createProductValidation), createProduct);

router.route('/:id')
  .get(validateRequest(productIdValidation), getProduct)
  .put(validateRequest(updateProductValidation), updateProduct)
  .delete(validateRequest(productIdValidation), deleteProduct);


router.patch('/:id/add-stock', validateRequest(stockQuantityValidation), addStock);
router.patch('/:id/remove-stock', validateRequest(stockQuantityValidation), removeStock);

module.exports = router;