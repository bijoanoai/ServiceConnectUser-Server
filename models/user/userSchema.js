const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  dateofBirth: {
    type: Date,
    required: false,
  },
  email: {
    type: String,
    required:false
  },
  phone: {
    type: Number,
    required:false
  },
  gender: {
    type: String,
    required: false,
  },
  houseName: {
    type: String,
    required: false,
  },
  landMark: {
    type: String,
    required: false,
  },
  pincode: {
    type: Number,
    required: false,
  },
  district: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: Object,
  },
  role: {
    type: String,
    default: 'user',
  },
  isactive: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("user", userSchema);
