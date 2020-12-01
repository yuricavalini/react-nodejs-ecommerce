const Joi = require('joi');

module.exports = {
  getProductsSchema: Joi.object().keys({
    query: Joi.object().keys({
      category: Joi.string().trim().empty('').max(20),
      searchKeyword: Joi.string().trim().empty('').max(20),
      sortOrder: Joi.string().trim().empty('').max(10),
    }),
  }),

  getProductSchema: Joi.object().keys({
    params: Joi.object().keys({
      productId: Joi.string().hex().trim().length(24).required(),
    }),
  }),

  createProductSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),
    body: Joi.object().keys({
      title: Joi.string().trim().min(2).max(50).required(),
      brand: Joi.string().trim().min(2).max(50).required(),
      price: Joi.string()
        .trim()
        .pattern(/^\d{1,15}(\.\d{1,2})?$/)
        .required(),
      category: Joi.string().trim().min(2).max(20).required(),
      countInStock: Joi.number().integer().min(0).required(),
      description: Joi.string().trim().min(0).max(350).required(),
      imagesUrl: Joi.array()
        .items(
          Joi.object().keys({
            path: Joi.string().required(),
          })
        )
        .min(1)
        .max(15)
        .required(),
    }),
  }),

  updateProductSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),
    params: Joi.object().keys({
      productId: Joi.string().hex().trim().length(24).required(),
    }),
    body: Joi.object().keys({
      title: Joi.string().trim().min(2).max(50).required(),
      brand: Joi.string().trim().min(2).max(50).required(),
      price: Joi.string()
        .trim()
        .pattern(/^\d{1,15}(\.\d{1,2})?$/)
        .required(),
      category: Joi.string().trim().min(2).max(20).required(),
      countInStock: Joi.number().integer().min(0).required(),
      description: Joi.string().trim().min(0).max(350).required(),
      imagesUrl: Joi.array()
        .items(
          Joi.object().keys({
            path: Joi.string().required(),
          })
        )
        .min(1)
        .max(15)
        .required(),
    }),
  }),

  deleteProductSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),
    params: Joi.object().keys({
      productId: Joi.string().hex().trim().length(24).required(),
    }),
  }),

  createReviewSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),
    params: Joi.object().keys({
      productId: Joi.string().hex().trim().length(24).required(),
    }),
    body: Joi.object().keys({
      username: Joi.string().trim().min(2).max(20).required(),
      rating: Joi.number().min(0).max(5).precision(1).required().strict(),
      comment: Joi.string().trim().max(20).required().empty(''),
    }),
  }),
};
