// backend/models/User.js - User model with profile fields for AI Financial Assistant

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  preferences: {
    currency: {
      type: String,
      default: 'NGN'
    },
    theme: {
      type: String,
      default: 'dark'
    }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
