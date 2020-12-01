const fs = require('fs');

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const env = require('./config/env');

module.exports = {
  gerenateToken(user) {
    return jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      env.JWT_SECRET_KEY,
      {
        expiresIn: '2h',
      }
    );
  },

  async generateCryptoToken() {
    const TOKEN_SIZE = 32;

    const randomBytesAsync = promisify(crypto.randomBytes);

    function getTokenSize(size) {
      return randomBytesAsync(size);
    }

    async function stringifyToken() {
      const token = await getTokenSize(TOKEN_SIZE);

      return token.toString('hex');
    }

    return stringifyToken();
  },

  deleteFile(filePath) {
    fs.unlink(filePath, err => {
      if (err) {
        throw err;
      }
    });
  },

  async imagesProcessor(req, res, next) {
    try {
      let requestImages;
      if (req.files) {
        requestImages = await req.files.map(image => {
          return {
            path: image.path,
          };
        });
        req.body.imagesUrl = requestImages;
      }

      return next();
    } catch (err) {
      return next(err);
    }
  },
};
