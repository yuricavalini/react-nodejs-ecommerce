const express = require('express');

const orderController = require('../controllers/order');
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const validator = require('../middleware/validator');
const {
  getOrdersSchema,
  getOrderSchema,
  createOrderSchema,
  deleteOrderSchema,
} = require('../validators/order');

const router = express.Router();

router.get(
  '/orders',
  isAuth,
  validator(getOrdersSchema),
  orderController.getOrders
);

router.get(
  '/orders/:orderId',
  isAuth,
  validator(getOrderSchema),
  orderController.getOrder
);

router.post(
  '/orders',
  isAuth,
  validator(createOrderSchema),
  orderController.createOrder
);

router.delete(
  '/orders/:orderId',
  isAuth,
  isAdmin,
  validator(deleteOrderSchema),
  orderController.deleteOrder
);

module.exports = router;
