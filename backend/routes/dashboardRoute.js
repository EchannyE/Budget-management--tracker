import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateProfile, getProfile, deleteUser } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', authMiddleware, getProfile);

router.put('/', authMiddleware, updateProfile); 

router.delete('/', authMiddleware, deleteUser);


export default router;
