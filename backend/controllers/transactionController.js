import Transaction from "../models/Transaction.js";
import { checkBudgetLimit } from "../utils/checkBudgetLimit.js";
import { errorHandler } from "../middleware/errorHandler.js";


//  Create Transaction (Income or Expense)
export const createTransaction = async (req, res) => {
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

    // Check budget limit for this category
    await checkBudgetLimit(req.user._id, category);

    res.status(201).json({
      success: true,
      message: "Transaction added successfully.",
      transaction,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

//  Get all transactions for logged-in user
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

//  Get insights by category
export const getTransactionInsights = async (req, res) => {
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
      message: "Transaction insights generated successfully.",
      insights,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

//  Update Transaction
export const updateTransaction = async (req, res) => {
  try {
    const { amount, category, type, description } = req.body;

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { amount, category, type, description },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    await checkBudgetLimit(req.user._id, category);

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
      transaction: updatedTransaction,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

//  Get Summary (Total Income, Total Expense, Balance)
export const getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const summary = await Transaction.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const totalIncome = summary.find((t) => t._id === "income")?.total || 0;
    const totalExpense = summary.find((t) => t._id === "expense")?.total || 0;
    const balance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      message: "Transaction summary retrieved successfully.",
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

//  Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully.",
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
