const mongoose = require('mongoose');

const profileSchema = {
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  avatar: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  zipCode: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: '' },
};

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    resetToken: String,
    resetTokenExpiration: Date,
    profile: profileSchema,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
