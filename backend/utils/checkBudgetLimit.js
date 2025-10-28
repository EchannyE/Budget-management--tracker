import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";

export const checkBudgetLimit = async (userId, category) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const budget = await Budget.findOne({
      user: userId,
      category: { $regex: new RegExp(`^${category}$`, "i") },
      isActive: true,
    });

    if (!budget) return;

    const totalSpent = await Transaction.aggregate([
      { $match: { user: user._id, category, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const spent = totalSpent[0]?.total || 0;

    budget.spent = spent;
    budget.remaining = Math.max(0, budget.limit - spent);
    await budget.save();

    if (spent > budget.limit) {
      const overshoot = (spent - budget.limit).toFixed(2);

      await sendEmail(
        user.email,
        " Budget Limit Exceeded",
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
    }
  } catch (err) {
    console.error(" Error in checkBudgetLimit:", err.message);
  }
};
