const express = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');

const productController = require('../controllers/product');

const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const { imagesProcessor } = require('../utils');
const validator = require('../middleware/validator');
const {
  getProductsSchema,
  getProductSchema,
  createProductSchema,
  createReviewSchema,
  updateProductSchema,
  deleteProductSchema,
} = require('../validators/product');

const router = express.Router();
const upload = multer(multerConfig);

router.get(
  '/products',
  validator(getProductsSchema),
  productController.getProducts
);

router.get(
  '/products/:productId',
  validator(getProductSchema),
  productController.getProduct
);

router.post(
  '/products',
  isAuth,
  isAdmin,
  upload.array('imagesUrl'),
  imagesProcessor,
  validator(createProductSchema),
  productController.createProduct
);

router.put(
  '/products/:productId',
  isAuth,
  isAdmin,
  upload.array('imagesUrl'),
  imagesProcessor,
  validator(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/products/:productId',
  isAuth,
  isAdmin,
  validator(deleteProductSchema),
  productController.deleteProduct
);

router.post(
  '/products/:productId/reviews',
  isAuth,
  validator(createReviewSchema),
  productController.createReview
);

module.exports = router;
