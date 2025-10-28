import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  limit: {
    type: Number,
    required: true,
    min: 0,
  },
  period: {
    type: String,
    enum: ["weekly", "monthly", "yearly", "custom"],
    default: "monthly",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("Budget", BudgetSchema);
