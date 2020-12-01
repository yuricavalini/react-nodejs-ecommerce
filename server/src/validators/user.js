const Joi = require('joi');

module.exports = {
  postSignupSchema: Joi.object().keys({
    body: Joi.object().keys({
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      password: Joi.string().trim().min(4).required(),
    }),
  }),

  postSigninSchema: Joi.object().keys({
    body: Joi.object().keys({
      email: Joi.string().email().trim().required(),
      password: Joi.string().trim().min(4).required(),
    }),
  }),

  getUserProfileSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),
  }),

  updateUserProfileSchema: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().hex().trim().length(24).required(),
      username: Joi.string().trim().min(2).max(20).required(),
      email: Joi.string().email().trim().required(),
      isAdmin: Joi.boolean().required(),
      iat: Joi.number().integer().positive().required(),
      exp: Joi.number().integer().greater(Joi.ref('iat')).required(),
    }),
    body: Joi.object().keys({
      username: Joi.string().trim().empty('').min(2).max(20),
      email: Joi.string().email().trim().empty(''),
      avatar: Joi.string().trim().empty(''),
      firstName: Joi.string().trim().empty('').min(2).max(20),
      lastName: Joi.string().trim().empty('').min(2).max(20),
      phoneNumber: Joi.string().trim().empty('').max(20),
      address: Joi.string().trim().empty('').min(2).max(50),
      city: Joi.string().trim().empty('').min(2).max(20),
      zipCode: Joi.string().trim().empty('').min(8).max(20),
      state: Joi.string().trim().empty('').min(2).max(20),
      country: Joi.string().trim().empty('').min(2).max(50),
    }),
  }),

  postResetSchema: Joi.object().keys({
    body: Joi.object().keys({
      email: Joi.string().email().trim().required(),
    }),
  }),

  getNewPasswordSchema: Joi.object().keys({
    params: Joi.object().keys({
      token: Joi.string().hex().trim().length(64).required(),
    }),
  }),

  postNewPasswordSchema: Joi.object().keys({
    body: Joi.object().keys({
      password: Joi.string().trim().min(4).required(),
      confirmPassword: Joi.string()
        .trim()
        .min(4)
        .valid(Joi.ref('password'))
        .required(),
      resetToken: Joi.string().hex().trim().length(64).required(),
    }),
  }),
};
