import mongoose from 'mongoose';

const expensesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  
    category: {
      type: String,
      // enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health'],
      default: 'Others',
    },
  },
  { timestamps: true }
);

const Expenses = mongoose.model('Expenses', expensesSchema);

export default Expenses;
