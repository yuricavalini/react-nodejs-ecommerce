const express = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');

const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');
const validator = require('../middleware/validator');
const {
  postSignupSchema,
  postSigninSchema,
  getUserProfileSchema,
  updateUserProfileSchema,
  postResetSchema,
  getNewPasswordSchema,
  postNewPasswordSchema,
} = require('../validators/user');

const router = express.Router();
const upload = multer(multerConfig);

router.post('/signin', validator(postSigninSchema), userController.postSignin);

router.post('/signup', validator(postSignupSchema), userController.postSignup);

router.get(
  '/profile',
  isAuth,
  validator(getUserProfileSchema),
  userController.getUserProfile
);

router.patch(
  '/profile',
  isAuth,
  upload.single('avatar'),
  validator(updateUserProfileSchema),
  userController.updateUserProfile
);

router.post('/reset', validator(postResetSchema), userController.postReset);

router.get(
  '/reset/:token',
  validator(getNewPasswordSchema),
  userController.getNewPassword
);

router.patch(
  '/reset/:token',
  validator(postNewPasswordSchema),
  userController.postNewPassword
);

module.exports = router;
