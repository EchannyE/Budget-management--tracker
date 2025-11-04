import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { createAccessToken, createRefreshToken } from '../utils/tokenUtils.js';

//  Register a new user
 
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const accessToken = createAccessToken(newUser);
    const refreshToken = createRefreshToken(newUser);

    // Send cookie + response
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      })
      .status(201)
      .json({
        success: true,
        message: 'Registration successful',
        token: accessToken,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
  } catch (error) {
    next(error);
  }
};

//  Login user
 
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid email or password', 400));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid email or password', 400));
    }

    // Tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: 'Login successful',
        token: accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    next(error);
  }
};

//  Refresh access token
 
export const refreshAccessToken = (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(new ErrorResponse('No refresh token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = createAccessToken({ _id: decoded.id });

    res.status(200).json({ success: true, token: accessToken });
  } catch (error) {
    next(new ErrorResponse('Invalid or expired refresh token', 403));
  }
};

//  Logout user
 
export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
