import express from 'express';
import { 
  createTransaction, 
  getTransactions, 
  getTransactionInsights, 
  updateTransaction, 
  deleteTransaction, 
  getTransactionSummary
} from '../controllers/transactionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, getTransactions);
router.get('/insights', authMiddleware, getTransactionInsights);
router.get('/summary', authMiddleware, getTransactionSummary);
router.put('/:id', authMiddleware, updateTransaction);
router.delete('/:id', authMiddleware, deleteTransaction);

export default router;
