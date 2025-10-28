import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { checkBudgetLimit } from "../utils/checkBudgetLimit.js";

// Set or update budget for a category
export const setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const userId = req.user.id;

    if (!category || !limit) {
      return res.status(400).json({ message: "Category and limit are required" });
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
      message: " Budget saved successfully",
      budget,
    });
  } catch (error) {
    console.error("Error setting budget:", error.message);
    res.status(500).json({ message: " Error setting budget", error: error.message });
  }
};

// add expense to budget (auto-check)
export const addExpenseToBudget = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;
    const userId = req.user.id;
    if (!category || !amount) {
      return res.status(400).json({ message: "Category and amount are required" });
    }
    const transaction = await Transaction.create({
      user: userId,
      type: "expense",
      category,
      amount,
      description,
      date: date || new Date(),
    });
    if (spent > Budget.limit) {
  const overshoot = (spent - Budget.limit).toFixed(2);

  console.log(` Budget exceeded for ${category}! Sending email to ${user.email}...`);

  await sendEmail(
    user.email,
    " Budget Limit Exceeded",
    `
Hi ${user.name || "User"},

You've exceeded your budget for the **${category}** category.

- Budget Limit: ₦${Budget.limit.toLocaleString()}
- Current Spending: ₦${spent.toLocaleString()}
- Overshoot: ₦${overshoot.toLocaleString()}

Please review your expenses.

— Budget Tracker Team
    `
  );

  console.log("Email process completed for:", user.email);
}

    // Check and update budget limit
    await checkBudgetLimit(userId, category);
    res.status(201).json({
      success: true,
      message: " Expense added successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error adding expense to budget:", error.message);
    res.status(500).json({ message: " Error adding expense to budget", error: error.message });
  }
};

// Get all budgets for user
export const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: " Budgets fetched successfully",
      budgets,
    });
  } catch (error) {
    console.error("Error fetching budgets:", error.message);
    res.status(500).json({ message: " Error fetching budgets", error: error.message });
  }
};
// Get budget by ID
export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({
      success: true,
      budget,
    });
  } catch (error) {
    console.error("Error fetching budget:", error.message);
    res.status(500).json({ message: " Error fetching budget", error: error.message });
  }
};




//  Update budget by ID

export const updateBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { category, limit },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({
      success: true,
      message: " Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error("Error updating budget:", error.message);
    res.status(500).json({ message: " Error updating budget", error: error.message });
  }
};

// Delete budget by ID
export const deleteBudget = async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({
      success: true,
      message: " Budget deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting budget:", error.message);
    res.status(500).json({ message: " Error deleting budget", error: error.message });
  }
};

// add expenses
export const addExpense = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;
    const userId = req.user.id;

    if (!category || !amount) {
      return res.status(400).json({ message: "Category and amount are required" });
    }

    const transaction = await Transaction.create({
      user: userId,
      type: "expense",
      category,
      amount,
      description,
      date: date || new Date(),
    });

    // Update and verify budget limit
    await checkBudgetLimit(userId, category);

    res.status(201).json({
      success: true,
      message: " Expense added successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error adding expense:", error.message);
    res.status(500).json({ message: " Error adding expense", error: error.message });
  }
};


