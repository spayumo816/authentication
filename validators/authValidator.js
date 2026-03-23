import { body } from "express-validator";

const normalizeSpaces = (value) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim() : value;

const nameRule = (fieldName, label) =>
  body(fieldName)
    .customSanitizer(normalizeSpaces)
    .notEmpty()
    .withMessage(`${label} is required`)
    .isLength({ min: 2, max: 50 })
    .withMessage(`${label} must be between 2 and 50 characters`);

const emailRule = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please provide a valid email address")
  .normalizeEmail();

const passwordRule = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long");

const newPasswordRule = body("newPassword")
  .notEmpty()
  .withMessage("New password is required")
  .isLength({ min: 8 })
  .withMessage("New password must be at least 8 characters long");

const otpRule = body("otp")
  .trim()
  .notEmpty()
  .withMessage("OTP is required")
  .isLength({ min: 6, max: 6 })
  .withMessage("OTP must be exactly 6 digits")
  .isNumeric()
  .withMessage("OTP must contain digits only");

const phoneRule = body("phone")
  .optional({ values: "falsy" })
  .trim()
  .isLength({ min: 7, max: 20 })
  .withMessage("Phone number must be between 7 and 20 characters");

const roleRule = body("role")
  .optional()
  .trim()
  .isIn(["resident"])
  .withMessage("Only resident self-registration is allowed");

const optionalAddressRules = [
  body("address.street")
    .optional({ values: "falsy" })
    .customSanitizer(normalizeSpaces)
    .isLength({ max: 150 })
    .withMessage("Street must not exceed 150 characters"),

  body("address.barangay")
    .optional({ values: "falsy" })
    .customSanitizer(normalizeSpaces)
    .isLength({ max: 100 })
    .withMessage("Barangay must not exceed 100 characters"),

  body("address.city")
    .optional({ values: "falsy" })
    .customSanitizer(normalizeSpaces)
    .isLength({ max: 100 })
    .withMessage("City must not exceed 100 characters"),

  body("address.province")
    .optional({ values: "falsy" })
    .customSanitizer(normalizeSpaces)
    .isLength({ max: 100 })
    .withMessage("Province must not exceed 100 characters"),
];

const optionalLocationRules = [
  body("location.lat")
    .optional({ values: "falsy" })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid number between -90 and 90"),

  body("location.lng")
    .optional({ values: "falsy" })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid number between -180 and 180"),
];

export const registerValidator = [
  nameRule("firstName", "First name"),
  nameRule("lastName", "Last name"),
  emailRule,
  passwordRule,
  phoneRule,
  roleRule,
  ...optionalAddressRules,
  ...optionalLocationRules,
];

export const verifyEmailValidator = [emailRule, otpRule];

export const resendVerificationOtpValidator = [emailRule];

export const loginValidator = [emailRule, passwordRule];

export const forgotPasswordValidator = [emailRule];

export const resetPasswordValidator = [emailRule, otpRule, newPasswordRule];