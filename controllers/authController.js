import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import Resident from "../models/residentModel.js";
import Collector from "../models/collectorModel.js";
import LGU from "../models/lguAdminModel.js";

import { sendOTPEmail } from "../utils/emailUtils.js";

import {
  setOtpForUser,
  verifyUserOtp,
  clearOtpForUser,
} from "../services/otpService.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sanitizeUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
});

const deleteUserAndProfiles = async (userId) => {
  await Promise.all([
    Resident.deleteOne({ user: userId }),
    Collector.deleteOne({ user: userId }),
    LGU.deleteOne({ user: userId }),
    User.deleteOne({ _id: userId }),
  ]);
};

const deleteExpiredUnverifiedUserByEmail = async (email) => {
  const existingUser = await User.findOne({ email });

  if (
    existingUser &&
    !existingUser.isVerified &&
    existingUser.otpExpires &&
    existingUser.otpExpires < new Date()
  ) {
    await deleteUserAndProfiles(existingUser._id);
    return true;
  }

  return false;
};

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      address,
      location,
    } = req.body;

    if (role && role !== "resident") {
      return res.status(403).json({
        message: "Only residents can self-register",
      });
    }

    await deleteExpiredUnverifiedUserByEmail(email);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.isVerified
          ? "User already exists with this email"
          : "An unverified account already exists. Please verify your email or resend OTP.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "resident",
      phone: phone || undefined,
      isVerified: false,
      otp: undefined,
      otpExpires: undefined,
    });

    try {
      await Resident.create({
        user: user._id,
        address: {
          street: address?.street || null,
          barangay: address?.barangay || null,
          city: address?.city || null,
          province: address?.province || null,
        },
        location: {
          lat: location?.lat ?? null,
          lng: location?.lng ?? null,
        },
      });
    } catch (error) {
      await User.deleteOne({ _id: user._id });

      return res.status(500).json({
        message: "Resident profile creation failed",
        error: error.message,
      });
    }

    try {
      const plainOtp = await setOtpForUser(user);
      await sendOTPEmail(user.email, "Verify Your Email", plainOtp);
    } catch (error) {
      await deleteUserAndProfiles(user._id);

      return res.status(500).json({
        message: "Registration failed because OTP email could not be sent",
        error: error.message,
      });
    }

    return res.status(201).json({
      message: "Resident registered successfully. Please verify your email.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const otpCheck = await verifyUserOtp(user, otp);

    if (!otpCheck.valid) {
      if (otpCheck.reason === "NO_OTP") {
        return res.status(400).json({
          message: "No verification OTP found. Please request a new one.",
        });
      }

      if (otpCheck.reason === "EXPIRED") {
        await deleteUserAndProfiles(user._id);

        return res.status(400).json({
          message: "Verification OTP expired. Please register again.",
        });
      }

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    await clearOtpForUser(user);

    const resident = await Resident.findOne({ user: user._id });
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Email verified successfully",
      token,
      user: sanitizeUser(user),
      resident,
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({
      message: "Server error during email verification",
      error: error.message,
    });
  }
};

export const resendVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      await deleteUserAndProfiles(user._id);

      return res.status(400).json({
        message: "Unverified account expired and was deleted. Please register again.",
      });
    }

    const plainOtp = await setOtpForUser(user);
    await sendOTPEmail(user.email, "Resend Email Verification OTP", plainOtp);

    return res.status(200).json({
      message: "Verification OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend verification OTP error:", error);
    return res.status(500).json({
      message: "Server error while resending verification OTP",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (
      user.role === "resident" &&
      !user.isVerified &&
      user.otpExpires &&
      user.otpExpires < new Date()
    ) {
      await deleteUserAndProfiles(user._id);

      return res.status(403).json({
        message: "Your unverified account expired and was deleted. Please register again.",
      });
    }

    if (user.role === "resident" && !user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    let resident = null;

    if (user.role === "resident") {
      resident = await Resident.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
      resident,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logout successful. Remove token on the client side.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Server error during logout",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with that email",
      });
    }

    const plainOtp = await setOtpForUser(user);
    await sendOTPEmail(user.email, "Reset Your Password", plainOtp);

    return res.status(200).json({
      message: "Password reset OTP sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Server error during forgot password",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otpCheck = await verifyUserOtp(user, otp);

    if (!otpCheck.valid) {
      if (otpCheck.reason === "NO_OTP") {
        return res.status(400).json({
          message: "No reset OTP found for this account",
        });
      }

      if (otpCheck.reason === "EXPIRED") {
        await clearOtpForUser(user);

        return res.status(400).json({
          message: "OTP has expired",
        });
      }

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await clearOtpForUser(user);

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Server error during password reset",
      error: error.message,
    });
  }
};