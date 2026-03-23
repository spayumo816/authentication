import express from "express";

import {
  registerUser,
  verifyEmail,
  resendVerificationOtp,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  registerValidator,
  verifyEmailValidator,
  resendVerificationOtpValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, registerUser); //ok
router.post("/verify-email", verifyEmailValidator, validateRequest, verifyEmail); //ok
router.post(
  "/resend-verification-otp",
  resendVerificationOtpValidator,
  validateRequest,
  resendVerificationOtp
);
router.post("/login", loginValidator, validateRequest, loginUser); //ok
router.post("/logout", logoutUser);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  forgotPassword
); // ok
router.post(
  "/reset-password",
  resetPasswordValidator,
  validateRequest,
  resetPassword
); // ok

// optional test route
router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    message: "Authorized user",
    user: req.user,
  });
});

export default router;