import Transaction from '../models/Transaction.js';
import { errorHandler } from '../middleware/errorHandler.js';

//  Get Monthly Spending Stats
export const getMonthlySpending = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const stats = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $substr: ['$date', 0, 7] }, // "YYYY-MM"
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedStats = stats.map((item) => ({
      month: item._id,
      total: item.total,
    }));

    res.status(200).json({
      message: 'Monthly spending stats retrieved successfully',
      data: formattedStats,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
