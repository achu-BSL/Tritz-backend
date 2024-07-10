import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Database connection established");
  } catch (err) {
    console.log("Database connection failed", err);
    process.exit(1);
  }
};
