import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // added extra safety check for invalid token payload
    if (!decoded?.id) {
      return res.status(401).json({
        message: "Not authorized, invalid token payload",
      });
    }

    const user = await User.findById(decoded.id).select(
      "-password -otp -otpExpires"
    );

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }

    if (user.role === "resident" && !user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

// added reusable role-based authorization middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // extra safety check in case protect middleware was skipped
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized, user data not found",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};
