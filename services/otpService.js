import bcrypt from "bcrypt";
import { generateOTP, generateOTPExpiry } from "../utils/otpUtils.js";

const OTP_SALT_ROUNDS = 10;

export const generateHashedOtpPayload = async (minutes = 10) => {
  const plainOtp = generateOTP();
  const hashedOtp = await bcrypt.hash(plainOtp, OTP_SALT_ROUNDS);
  const expiresAt = generateOTPExpiry(minutes);

  return {
    plainOtp,
    hashedOtp,
    expiresAt,
  };
};

export const setOtpForUser = async (user, minutes = 10) => {
  const { plainOtp, hashedOtp, expiresAt } =
    await generateHashedOtpPayload(minutes);

  user.otp = hashedOtp;
  user.otpExpires = expiresAt;
  await user.save();

  return plainOtp;
};

export const verifyUserOtp = async (user, plainOtp) => {
  if (!user.otp || !user.otpExpires) {
    return {
      valid: false,
      reason: "NO_OTP",
    };
  }

  if (user.otpExpires < new Date()) {
    return {
      valid: false,
      reason: "EXPIRED",
    };
  }

  const isMatch = await bcrypt.compare(plainOtp, user.otp);

  if (!isMatch) {
    return {
      valid: false,
      reason: "INVALID",
    };
  }

  return {
    valid: true,
    reason: null,
  };
};

export const clearOtpForUser = async (user) => {
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
};