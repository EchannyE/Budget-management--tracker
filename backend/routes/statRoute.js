import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMonthlySpending } from '../controllers/statController.js';


const router = express.Router();

router.get('/monthly', authMiddleware, getMonthlySpending);

export default router;