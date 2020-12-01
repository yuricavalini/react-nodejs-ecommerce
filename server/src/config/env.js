require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/ecommerce',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'supersecretkey',
  GMAILUSER: process.env.GMAILUSER,
  GMAILPASSWORD: process.env.GMAILPASSWORD,
  GMAILTEST: process.env.GMAILTEST,
};
