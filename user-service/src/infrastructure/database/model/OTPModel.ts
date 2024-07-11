import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

const otpModel = mongoose.model("otp", otpSchema);

export default otpModel;
