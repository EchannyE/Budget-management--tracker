import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { createAccessToken, createRefreshToken } from '../utils/tokenUtils.js';

// REGISTER USER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate tokens
    const accessToken = createAccessToken(newUser);
    const refreshToken = createRefreshToken(newUser);

    // Send cookies + response
    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({
        message: 'Registration successful',
        token: accessToken,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.error('Registration error:', error);
    return res
      .status(500)
      .json({ message: 'Registration failed', error: error.message });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials (email)' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials (password)' });

    // Generate tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'Login successful',
        token: accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    console.error('Login error:', error);
    return res
      .status(500)
      .json({ message: 'Login failed', error: error.message });
  }
};

// REFRESH ACCESS TOKEN
export const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = createAccessToken({ _id: decoded.id });
    return res.json({ token: accessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// LOGOUT USER
export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out successfully' });
};
