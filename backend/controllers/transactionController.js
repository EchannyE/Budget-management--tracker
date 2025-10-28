import Transaction from "../models/Transaction.js";
import { checkBudgetLimit } from "../utils/checkBudgetLimit.js";

// Create Transaction (Income or Expense)
export const createTransaction = async (req, res, next) => {
  try {
    const { amount, category, type, description } = req.body;

    if (!amount || !category || !type) {
      return res.status(400).json({
        success: false,
        message: "Amount, category, and type are required.",
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      amount: parseFloat(amount),
      category: category.trim(),
      type,
      description: description?.trim() || "",
    });

    // Check if budget exceeded for this category
    await checkBudgetLimit(req.user._id, category);

    res.status(201).json({
      success: true,
      message: "Transaction added successfully.",
      transaction,
    });
  } catch (err) {
    console.error(" Error creating transaction:", err);
    next(err);
  }
};

// Get all transactions for user
export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    next(err);
  }
};


// Get insights by category
export const getTransactionInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const insights = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "Transaction insights generated.",
      insights,
    });
  } catch (err) {
    console.error(" Error getting transaction insights:", err);
    next(err);
  }
};

// Update transaction
export const updateTransaction = async (req, res, next) => {
  try {
    const { amount, category, type, description } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        amount,
        category,
        type,
        description,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    await checkBudgetLimit(req.user._id, category);

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
      updated,
    });
  } catch (err) {
    console.error(" Error updating transaction:", err);
    next(err);
  }
};

// Summary (Total Income, Total Expense, Balance)
export const getTransactionSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const summary = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome =
      summary.find((t) => t._id === "income")?.total || 0;
    const totalExpense =
      summary.find((t) => t._id === "expense")?.total || 0;
    const balance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (err) {
    console.error("Error generating summary:", err);
    next(err);
  }
};

// Delete transaction
export const deleteTransaction = async (req, res, next) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully.",
    });
  } catch (err) {
    console.error(" Error deleting transaction:", err);
    next(err);
  }
};
