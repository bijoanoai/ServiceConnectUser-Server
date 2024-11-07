const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: { type: String, required: true },
  contact: { type: String, required: true }, // email or phone
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  tempUserData:{type:Object}
});

module.exports = mongoose.model("OTP", otpSchema);
