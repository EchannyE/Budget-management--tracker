import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { checkBudgetLimit } from "../utils/checkBudgetLimit.js";
import { sendEmail } from "../services/emailService.js";
import { ErrorResponse } from "../middleware/errorHandler.js";

//  Set or update a budget for a category
export const setBudget = async (req, res, next) => {
  try {
    const { category, limit } = req.body;
    const userId = req.user.id;

    if (!category || !limit) {
      return next(new ErrorResponse("Category and limit are required", 400));
    }

    let budget = await Budget.findOne({ user: userId, category });

    if (budget) {
      budget.limit = limit;
      await budget.save();
    } else {
      budget = await Budget.create({ user: userId, category, limit });
    }

    res.status(200).json({
      success: true,
      message: "Budget saved successfully",
      budget,
    });
  } catch (error) {
    next(error);
  }
};

//  Add an expense and auto-check budget
export const addExpenseToBudget = async (req, res, next) => {
  try {
    const { category, amount, description, date } = req.body;
    const userId = req.user.id;

    if (!category || !amount) {
      return next(new ErrorResponse("Category and amount are required", 400));
    }

    // Create expense transaction
    const transaction = await Transaction.create({
      user: userId,
      type: "expense",
      category,
      amount,
      description,
      date: date || new Date(),
    });

    // Calculate total spent in this category
    const totalSpent = await Transaction.aggregate([
      { $match: { user: userId, category, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const spent = totalSpent[0]?.total || 0;

    // Get user budget and info
    const budget = await Budget.findOne({ user: userId, category });
    const user = req.user;

    if (budget && spent > budget.limit) {
      const overshoot = (spent - budget.limit).toFixed(2);

      console.log(`⚠️ Budget exceeded for ${category}. Sending alert to ${user.email}...`);

      await sendEmail(
        user.email,
        "Budget Limit Exceeded",
        `
Hi ${user.name || "User"},

You've exceeded your budget for the **${category}** category.

- Budget Limit: ₦${budget.limit.toLocaleString()}
- Current Spending: ₦${spent.toLocaleString()}
- Overshoot: ₦${overshoot.toLocaleString()}

Please review your expenses.

— Budget Tracker Team
        `
      );

      console.log(" Budget alert email sent to:", user.email);
    }

    // Verify and update budget status
    await checkBudgetLimit(userId, category);

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// Get all budgets for a user
export const getBudgets = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Budgets fetched successfully",
      budgets,
    });
  } catch (error) {
    next(error);
  }
};

//  Get a single budget by ID
export const getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return next(new ErrorResponse("Budget not found", 404));
    }

    res.status(200).json({
      success: true,
      budget,
    });
  } catch (error) {
    next(error);
  }
};

//  Update budget by ID
export const updateBudget = async (req, res, next) => {
  try {
    const { category, limit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { category, limit },
      { new: true }
    );

    if (!budget) {
      return next(new ErrorResponse("Budget not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    next(error);
  }
};

//  Delete budget by ID
export const deleteBudget = async (req, res, next) => {
  try {
    const deleted = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return next(new ErrorResponse("Budget not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//  Add expense (generic)
export const addExpense = async (req, res, next) => {
  try {
    const { category, amount, description, date } = req.body;
    const userId = req.user.id;

    if (!category || !amount) {
      return next(new ErrorResponse("Category and amount are required", 400));
    }

    const transaction = await Transaction.create({
      user: userId,
      type: "expense",
      category,
      amount,
      description,
      date: date || new Date(),
    });

    await checkBudgetLimit(userId, category);

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};
