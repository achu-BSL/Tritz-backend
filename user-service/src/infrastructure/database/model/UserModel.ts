import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    profile: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    DOB: {
      type: Date,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    preferredSports: {
      type: [String],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", UserSchema);

export default userModel;
