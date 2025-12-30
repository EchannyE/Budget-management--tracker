import express from 'express';
import {register, login, logout, refreshAccessToken, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();


// Forgot/reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logout);

export default router;
