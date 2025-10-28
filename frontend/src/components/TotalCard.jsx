import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import formatCurrency from '../Utils/formatCurrency';


const TotalCard = ({ title, amount, icon: Icon, color, className = '' }) => {
  
  const amountValue = Number(amount || 0);

  // --- Dynamic Style Configuration ---
  const baseStyles = {
    income: {
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      iconBg: "bg-green-200/50"
    },
    expense: {
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      iconBg: "bg-red-200/50"
    },
   
    balance: {
      isPositive: amountValue >= 0,
      bgColor: amountValue >= 0 ? "bg-indigo-50" : "bg-red-50",
      textColor: amountValue >= 0 ? "text-indigo-800" : "text-red-800",
      iconColor: amountValue >= 0 ? "text-indigo-600" : "text-red-600",
      iconBg: amountValue >= 0 ? "bg-indigo-200/50" : "bg-red-200/50"
    }
  };

 
  const mappedColor = color === 'red' ? 'expense' : color;
  
  const styles = baseStyles[mappedColor] || baseStyles.balance;
  
  const FinalIcon = Icon || (
    mappedColor === 'income' ? TrendingUp :
    mappedColor === 'expense' ? TrendingDown :
    amountValue >= 0 ? Wallet : TrendingDown
  );
  
  const formattedAmount = formatCurrency(amountValue);

  return (
    <div
      className={`p-5 rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-between flex-1 min-w-[200px] transition duration-300 hover:shadow-xl hover:scale-[1.01] ${styles.bgColor} ${className}`}
      role="status" 
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-bold text-sm uppercase tracking-wider ${styles.textColor}`}>
          {title}
        </h3>
        {FinalIcon && (
          <div className={`p-2 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            <FinalIcon className={`w-5 h-5 ${styles.iconColor}`} />
          </div>
        )}
      </div>
      
      <p className={`text-4xl font-extrabold mt-1 ${styles.textColor} truncate`} title={formattedAmount}>
        {formattedAmount}
      </p>
      
      {/* Informational badge/text */}
      {mappedColor === 'balance' && (
          <span className={`text-xs mt-1 font-medium ${styles.textColor}`}>
              {amountValue >= 0 ? 'Current Net Position' : 'Account Overdrawn'}
          </span>
      )}
    </div>
  );
};

export default TotalCard;