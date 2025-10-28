import express from "express";
import { setBudget, getBudgets, addExpense, updateBudget, deleteBudget } from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/set", authMiddleware, setBudget);
router.get("/all", authMiddleware, getBudgets);
router.post("/", authMiddleware, addExpense);
router.put("/:id", authMiddleware, updateBudget);
router.delete("/:id", authMiddleware, deleteBudget)

export default router;
