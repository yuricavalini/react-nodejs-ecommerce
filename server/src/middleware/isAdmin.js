module.exports = (req, res, next) => {
  if (req.user && !req.user.isAdmin) {
    return res.status(401).json({ message: 'Admin Token is not valid.' });
  }

  return next();
};
