const { ValidationError } = require('joi');
const { MulterError } = require('multer');
const { Error } = require('mongoose');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const { message, data } = err;

  let status;

  if (err instanceof MulterError) {
    status = 'Upload failed';
  }

  if (err instanceof ValidationError) {
    status = 'Validation failed';
  }

  if (err instanceof Error) {
    status = 'Database failed';
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({ message, data, status, statusCode });
};
