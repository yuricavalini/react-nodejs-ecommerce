module.exports = schema => {
  return async (req, res, next) => {
    try {
      const data = await schema.validateAsync(req, {
        abortEarly: false,
        allowUnknown: true,
      });

      req.headers = data.headers;
      req.params = data.params;
      req.query = data.query;
      req.body = data.body;
      req.user = data.user;

      return next();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 422;
      }
      return next(err);
    }
  };
};
