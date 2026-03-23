import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["resident", "lgu", "collector"],
      default: "resident",
    },

    phone: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // optional if kailangan ng email verification
    otp: {
      type: String,
    },
    // optional if kailangan ng email verification
    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;