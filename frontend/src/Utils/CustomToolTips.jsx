import React from "react";
import formatCurrency from "./formatCurrency";
const CustomTooltips = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    if (label) {
      // Bar Chart Tooltip
      return (
        <div className="bg-white p-3 border border-gray-300 shadow-lg rounded-lg text-sm">
          <p className="font-bold text-gray-800 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: <span className="font-semibold">{formatCurrency(p.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    // Pie Chart Tooltip
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 shadow-lg rounded-lg text-sm">
        <p className="font-bold text-gray-800 mb-1">{data.name}</p>
        <p>
          Total: <span className="font-semibold">{formatCurrency(data.value)}</span>
        </p>
        <p>
          Share: <span className="font-semibold">{(data.percent * 100).toFixed(1)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltips;