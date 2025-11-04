import User from '../models/User.js';
import { errorHandler } from '../middleware/errorHandler.js';

//  Get user profile
export const getProfile = async (req, res) => {
  try {
    const subject = req.user;
    if (!subject) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(subject._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        budget: user.budgets,
        transactions: user.transactions,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

//  Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const subject = req.user;

    if (!subject) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findByIdAndUpdate(
      subject._id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

//  Delete user account
export const deleteUser = async (req, res) => {
  try {
    const subject = req.user;

    if (!subject) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const deletedUser = await User.findByIdAndDelete(subject._id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found for deletion' });
    }

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
