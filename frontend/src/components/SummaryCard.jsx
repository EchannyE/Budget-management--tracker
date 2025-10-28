import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import formatCurrency from '../Utils/formatCurrency';

// Utility function to determine icon and styles based on title and value
const getDynamicStyle = (title, value) => {
  const lowerTitle = title.toLowerCase();
  const isPositive = Number(value) >= 0;

  if (lowerTitle.includes('income')) {
    return { icon: TrendingUp, iconColor: 'text-green-500', bgColor: 'bg-green-50' };
  }
  if (lowerTitle.includes('expense')) {
    return { icon: TrendingDown, iconColor: 'text-red-500', bgColor: 'bg-red-50' };
  }
  if (lowerTitle.includes('balance') || lowerTitle.includes('net')) {
    return isPositive
      ? { icon: Wallet, iconColor: 'text-blue-500', bgColor: 'bg-blue-50' }
      : { icon: DollarSign, iconColor: 'text-red-500', bgColor: 'bg-red-50' };
  }

  return { icon: DollarSign, iconColor: 'text-gray-500', bgColor: 'bg-gray-100' };
};

const SummaryCard = ({ title, value = 0, dynamic = true }) => {
  const { icon: Icon, iconColor, bgColor } = dynamic ? getDynamicStyle(title, value) : {};
  const formattedValue = formatCurrency(value);

  return (
    <div
      className={`p-5 rounded-2xl shadow-md border border-gray-200 
      transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 
      ${bgColor} flex flex-col justify-between h-full`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm uppercase tracking-wider font-medium text-gray-600">
          {title}
        </h3>
        {Icon && (
          <Icon
            className={`w-6 h-6 p-1 rounded-full ${iconColor} bg-white/70 shadow-sm`}
          />
        )}
      </div>

      <p className="text-4xl font-extrabold text-gray-800">{formattedValue}</p>
    </div>
  );
};

export default SummaryCard;
