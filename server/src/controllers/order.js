const Order = require('../models/order');

module.exports = {
  async createOrder(req, res, next) {
    const order = new Order({
      user: { userId: req.user._id, email: req.user.email },
      orderItems: req.body.orderItems,
      shipping: req.body.shipping,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });

    try {
      await order.save();

      return res.status(201).json({
        message: 'Order Created Successfully!',
        _id: order._id,
        user: order.user,
        items: order.orderItems,
        total: order.totalPrice,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async getOrders(req, res, next) {
    try {
      const orders = await Order.find({ 'user.userId': req.user._id });

      const totalOrders = await Order.find({
        'user.userId': req.user._id,
      }).countDocuments();

      if (!orders || !totalOrders) {
        const error = new Error('Orders could not be found.');
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({
        message: 'Fetched Orders Successfully!',
        orders,
        totalOrders,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async getOrder(req, res, next) {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        const error = new Error('Order could not be found.');
        error.statusCode = 404;
        throw error;
      }

      if (order.user.userId.toString() !== req.user._id) {
        const error = new Error('Not Authorized!');
        error.statusCode = 403;
        throw error;
      }

      return res.status(200).json({
        message: 'Fetched Order Successfully!',
        order,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async deleteOrder(req, res, next) {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        const error = new Error('Order could not be found.');
        error.statusCode = 404;
        throw error;
      }

      await order.deleteOne();

      return res.status(200).json({ message: 'Order Deleted Successfully!' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },
};
