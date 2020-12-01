const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const env = require('../config/env');

const { gerenateToken, generateCryptoToken, deleteFile } = require('../utils');

module.exports = {
  async postSignup(req, res, next) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);

      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      await user.save();

      return res.status(201).json({
        message: 'New User Created Successfully!',
        token: gerenateToken(user),
        userId: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async postSignin(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        email,
      });

      if (!user) {
        const error = new Error('Invalid Email or Password');
        error.statusCode = 401;
        throw error;
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        const error = new Error('Invalid Email or Password');
        error.statusCode = 401;
        throw error;
      }

      return res.status(200).json({
        message: 'Login Successfully',
        token: gerenateToken(user),
        userId: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async getUserProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({
        message: 'Returned User Profile Successfully',
        userId: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profile: user.profile,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async updateUserProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      const userProfile = {
        avatar: user.profile.avatar,
        firstName: req.body.firstName || user.profile.firstName,
        lastName: req.body.lastName || user.profile.lastName,
        phoneNumber: req.body.phoneNumber || user.profile.phoneNumber,
        address: req.body.address || user.profile.address,
        city: req.body.city || user.profile.city,
        zipCode: req.body.zipCode || user.profile.zipCode,
        state: req.body.state || user.profile.state,
        country: req.body.country || user.profile.country,
      };

      user.profile = userProfile;

      const image = req.file;

      if (image) {
        if (user.profile.avatar === '') {
          user.profile.avatar = image.path;
        } else {
          deleteFile(user.profile.avatar);
          user.profile.avatar = image.path;
        }
      }

      await user.save();

      return res.status(200).json({
        message: 'User Profile Updated Successfully',
        token: gerenateToken(user),
        userId: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async postReset(req, res, next) {
    const MILLISECONDS_TO_EXPIRE = 3600000; // 60 minutes

    try {
      const token = await generateCryptoToken();

      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + MILLISECONDS_TO_EXPIRE;

      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: env.GMAILUSER,
          pass: env.GMAILPASSWORD,
        },
      });

      const uri = `http://${req.headers.host}/reset/${token}`;

      const mailData = await transporter.sendMail({
        from: env.GMAILUSER,
        to: env.GMAILTEST,
        subject: 'Node.js Password Reset ✔',
        html: `
          <p>You are receiving this because you (or someone else) have requested the reset of the password in Ecommerce.</p>
          <p>Please, click on the following link, or paste into your browser to complete the processs:</p>
          <a href=${uri}>${uri}</a>
          <br>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          `,
      });

      return res.status(200).json({
        message: 'Reset Token Generated Successfully',
        resetToken: user.resetToken,
        resetTokenExpiration: user.resetTokenExpiration,
        mailData,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async getNewPassword(req, res, next) {
    const { token } = req.params;
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });

      if (!user) {
        const error = new Error(
          'Password reset token is invalid or has expired.'
        );
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({
        message: 'Token Validated Successfully!',
        resetToken: token,
        userId: user._id,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async postNewPassword(req, res, next) {
    const { password, confirmPassword, resetToken } = req.body;

    try {
      const user = await User.findOne({
        resetToken,
        resetTokenExpiration: { $gt: Date.now() },
      });

      if (!user) {
        const error = new Error(
          'Password reset token is invalid or has expired.'
        );
        error.statusCode = 404;
        throw error;
      }

      if (password !== confirmPassword) {
        const error = new Error('Password do not match.');
        error.statusCode = 401;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;

      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: env.GMAILUSER,
          pass: env.GMAILPASSWORD,
        },
      });

      const mailData = await transporter.sendMail({
        from: env.GMAILUSER,
        to: env.GMAILTEST,
        subject: 'Your password has been changed ✔',
        html: `
          <p>Hello,</p>
          <p>This is a confirmation that the password for your account</p>
          <strong>${user.email}</strong>
          <br>
          <p>has just changed.</p>
          `,
      });

      return res.status(200).json({
        message: 'Password Reseted Successfully!',
        token: gerenateToken(user),
        userId: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        mailData,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },
};
