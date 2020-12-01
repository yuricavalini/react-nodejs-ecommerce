const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  const token = authorization.split(' ')[1];
  let decode;

  try {
    decode = jwt.verify(token, env.JWT_SECRET_KEY);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
  }

  if (!decode) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  req.user = decode;

  return next();
};
