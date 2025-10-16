import Expenses from '../models/expenses.js';



export const createExpenses = async (req, res, next) => {
  try {
    const { amount, date, category } = req.body;

    const expenses = new Expenses({
      user: req.user._id,
      amount,
      date,
      category,
    });

    const savedExpenses = await expenses.save();
    res.status(201).json(savedExpenses);
  } catch (err) {
    next(err);
  }
};

// Get all transactions

export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expenses.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    next(err);
  }
};

// Update a transaction
export const updateExpenses = async (req, res, next) => {
  try {
    const { amount, date, category } = req.body;
    const expenses = await Expenses.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { amount, date, category },
      { new: true }
    );
    if (!expenses) {
      return res.status(404).json({ message: 'Expenses not found' });
    }
    res.status(200).json(expenses);
  } catch (err) {
    next(err);
  }
};


//  Delete a transaction
export const deleteExpenses = async (req, res, next) => {
  try {
    const expenses = await Expenses.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expenses) {
      return res.status(404).json({ message: 'Expenses not found' });
    }

    res.status(200).json({ message: 'Expenses deleted successfully' });
  } catch (err) {
    next(err);
  }
};
