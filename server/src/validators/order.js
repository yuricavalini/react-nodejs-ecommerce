const Joi = require('joi');

module.exports = {
  createOrderSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),

    body: Joi.object().keys({
      orderItems: Joi.array()
        .items(
          Joi.object().keys({
            quantity: Joi.number().integer().min(1).required(),
            image: Joi.string().required(),
            price: Joi.number().min(0).precision(2).required().strict(),
            product: Joi.string().hex().trim().length(24),
          })
        )
        .min(1),
      shipping: Joi.object().keys({
        address: Joi.string().trim().min(2).max(50).required(),
        city: Joi.string().trim().min(2).max(20).required(),
        zipCode: Joi.string().trim().min(8).max(20).required(),
        state: Joi.string().trim().min(2).max(20).required(),
        country: Joi.string().trim().min(2).max(50).required(),
      }),
      paymentMethod: Joi.string().trim().min(2).max(20).required(),
      itemsPrice: Joi.number().min(0).precision(2).required().strict(),
      taxPrice: Joi.number().min(0),
      shippingPrice: Joi.number().min(0),
      totalPrice: Joi.number().min(0).precision(2).required().strict(),
    }),
  }),

  getOrdersSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),
  }),

  getOrderSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),
    params: Joi.object().keys({
      orderId: Joi.string().hex().trim().length(24).required(),
    }),
  }),

  deleteOrderSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),
  }),
  params: Joi.object().keys({
    orderId: Joi.string().hex().trim().length(24).required(),
  }),
};
