import { useEffect, useState, useCallback, useMemo } from "react";
import { transactionService, statsService } from "../services/apiServices";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const MonthlyTrend = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const summaryData = await transactionService.getSummary();
      const monthlyStats = await statsService.getMonthlyStats();
      setSummary({ ...summaryData, monthlyTrends: monthlyStats });
    } catch (error) {
      console.error("Error fetching monthly trends:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const monthlyTrendData = useMemo(() => {
    if (!summary) return [];
    if (summary?.monthlyTrends?.length) return summary.monthlyTrends;

    const currentMonth = new Date().toLocaleString("default", { month: "short" });
    return [
      { month: currentMonth, income: summary?.totalIncome || 0, expense: summary?.totalExpense || 0 },
    ];
  }, [summary]);

  if (loading)
    return (
      <div className="text-center py-10 text-xl text-gray-600">
        Loading Monthly Trends...
      </div>
    );

  return (
    <div className= " p-6 md:p-10 max-w-4xl bg-gray-100 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Monthly Trends</h1>

      {monthlyTrendData.length > 0 ? (
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={monthlyTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#9e9e9e" }} />
            <YAxis tickFormatter={value => `₦${value.toLocaleString()}`} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value, name) => [`₦${value.toLocaleString()}`, name]}
              contentStyle={{ borderRadius: "8px", backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Bar
              dataKey="income"
              fill="#10b981"
              name="Income"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              barSize={45}
            />
            <Bar
              dataKey="expense"
              fill="#f87171"
              name="Expense"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              barSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 py-16">
          Not enough data for monthly trend analysis.
        </div>
      )}
    </div>
  );
};

export default MonthlyTrend;
