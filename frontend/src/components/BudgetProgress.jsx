import React, { useMemo } from "react";
import formatCurrency from "../Utils/formatCurrency";

// Define color constants for readability
const COLOR_THRESHOLDS = {
    WARNING: 75, 
    CRITICAL: 100,
};



const BudgetProgress = ({ name, spent, limit }) => {
    
    // Encapsulate calculation and color logic
    const { percent, colorClass, exceeded } = useMemo(() => {
        const safeLimit = Number(limit) || 1; 
        const calculatedPercent = (Number(spent) / safeLimit) * 100;
        
        let cClass = "bg-green-500";
    
        if (calculatedPercent >= COLOR_THRESHOLDS.CRITICAL) {
            cClass = "bg-red-500";
        } else if (calculatedPercent >= COLOR_THRESHOLDS.WARNING) {
            cClass = "bg-yellow-500";
        }

        return {
            percent: calculatedPercent,
            colorClass: cClass,
            exceeded: calculatedPercent > COLOR_THRESHOLDS.CRITICAL,
        };
    }, [spent, limit]);
 
    const visualPercent = Math.min(percent, 100);

    const remainingAmount = limit - spent;
    const statusMessage = exceeded 
        ? ` Over limit by ${formatCurrency(Math.abs(remainingAmount))}`
        : ` ${formatCurrency(remainingAmount)} remaining this month`; 

    return (
        
        <div 
            className={`p-5 rounded-xl shadow-lg transition-all border-l-8 ${
                exceeded
                    ? "border-red-500 bg-red-50"
                    : "border-green-500 bg-white hover:shadow-xl"
            }`}
        >
            
            {/* Header: Name and Amounts */}
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-900 capitalize">{name}</h2>
                <div className="flex flex-col text-right">
                    <span 
                        className={`font-semibold text-base ${exceeded ? 'text-red-600' : 'text-gray-700'}`}
                    >
                        Spent: {formatCurrency(spent)}
                    </span>
                    <span className="text-gray-600 text-sm">
                        Limit: {formatCurrency(limit)}
                    </span>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div 
                className="w-full bg-gray-200 h-4 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={visualPercent}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Budget usage for ${name}: ${visualPercent.toFixed(1)}%`}
            >
                {/* Progress Bar */}
                <div
                    className={`${colorClass} h-4 transition-all duration-700`} 
                    style={{ width: `${visualPercent}%` }}
                />
            </div>
            
            {/* Status Message */}
            <p
                className={`mt-2 text-sm font-medium ${
                    exceeded ? "text-red-700" : "text-green-600"
                }`}
            >
                {statusMessage}
            </p>
        </div>
    );
};

export default BudgetProgress;