import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import { createAccessToken, createRefreshToken } from "../utils/tokenUtils.js";

/* ================================
   REGISTER
================================ */
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "Registration successful",
        token: accessToken,
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (error) {
    next(error);
  }
};

/* ================================
   LOGIN
================================ */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorResponse("Invalid email or password", 400));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorResponse("Invalid email or password", 400));

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token: accessToken,
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (error) {
    next(error);
  }
};

/* ================================
   FORGOT PASSWORD
================================ */
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    console.log("[ForgotPassword] Request for:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("[ForgotPassword] No user found with email:", email);
      return next(new ErrorResponse("No user found with that email", 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 min
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    const message = `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}" target="_blank">Click here to reset your password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail(user.email, "Password Reset Request", message);
      console.log(`[ForgotPassword] Reset email sent to: ${user.email}`);
    } catch (emailError) {
      console.error("[ForgotPassword] Error sending email:", emailError);
      return next(new ErrorResponse("Failed to send reset email", 500));
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.error("[ForgotPassword] General error:", error);
    next(new ErrorResponse("Failed to process forgot password request", 500));
  }
};

/* ================================
   RESET PASSWORD
================================ */
export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return next(new ErrorResponse("Password must be at least 6 characters", 400));
  }

  try {
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return next(new ErrorResponse("Invalid or expired token", 400));

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

/* ================================
   REFRESH TOKEN
================================ */
export const refreshAccessToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new ErrorResponse("No refresh token provided", 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = createAccessToken({ _id: decoded.id });
    res.status(200).json({ success: true, token: accessToken });
  } catch (error) {
    next(new ErrorResponse("Invalid or expired refresh token", 403));
  }
};

/* ================================
   LOGOUT
================================ */
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
