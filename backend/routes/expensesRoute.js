import express from "express";
import { createExpenses, getExpenses, updateExpenses, deleteExpenses } from "../controllers/expensesController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", authMiddleware, createExpenses);

router.get("/", authMiddleware, getExpenses);

router.put("/:id", authMiddleware, updateExpenses);

router.delete("/:id", authMiddleware, deleteExpenses);
export default router;