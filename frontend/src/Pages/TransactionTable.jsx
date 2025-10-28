import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { transactionService, emailService } from "../services/apiServices";
import {
  Plus,
  Trash2,
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import TotalCard from "../components/TotalCard";
import formatCurrency from "../Utils/formatCurrency";

const TransactionTable = () => {
  const navigate = useNavigate();
  const categoryInputRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [budgetAlert, setBudgetAlert] = useState("");
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    type: "expense",
    amount: "",
    description: "",
    date: new Date().toISOString().substring(0, 10),
  });
  const [errors, setErrors] = useState({});

  // --- Fetch all transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      const data = await transactionService.getAll();
      const txns = Array.isArray(data)
        ? data
        : Array.isArray(data.transactions)
        ? data.transactions
        : [];
      setTransactions(
        txns.sort(
          (a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        )
      );
    } catch (err) {
      console.error("Transaction fetch failed:", err);
      setAlert({ type: "error", message: "Failed to fetch transactions." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // --- Delete transaction
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this transaction?"))
        return;
      try {
        await transactionService.delete(id);
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        setAlert({ type: "success", message: "Transaction deleted successfully!" });
      } catch (err) {
        console.error("Delete error:", err);
        setAlert({ type: "error", message: " Failed to delete transaction." });
      } finally {
        setTimeout(() => setAlert({ type: "", message: "" }), 4000);
      }
    },
    []
  );

  // --- Validate input form
  const validateForm = useCallback(() => {
    const errs = {};
    if (!newTransaction.category.trim()) errs.category = "Category is required.";
    if (
      !newTransaction.amount ||
      isNaN(newTransaction.amount) ||
      parseFloat(newTransaction.amount) <= 0
    )
      errs.amount = "Enter a valid positive amount.";
    if (!newTransaction.date) errs.date = "Date is required.";
    return errs;
  }, [newTransaction]);

  // --- Create new transaction
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const created = await transactionService.create({
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
      });

      setTransactions((prev) => [created.transaction, ...prev]);
      setAlert({ type: "success", message: " Transaction added successfully!" });

      // Budget exceeded notification
      if (created.budgetExceeded) {
        const alertMsg = `Budget exceeded for "${created.category}" by ₦${(
          created.overshoot || 0
        ).toLocaleString()}`;
        setBudgetAlert(alertMsg);
        setTimeout(() => setBudgetAlert(""), 6000);

        try {
          await emailService.sendEmail(
            created.userEmail || "user@example.com",
            "Budget Limit Exceeded",
            alertMsg
          );
          console.log(" Budget alert email sent!");
        } catch (emailErr) {
          console.error("Email send error:", emailErr);
        }
      }

      // Reset form
      setNewTransaction({
        category: "",
        type: "expense",
        amount: "",
        description: "",
        date: new Date().toISOString().substring(0, 10),
      });
      categoryInputRef.current.focus();
    } catch (err) {
      console.error("Create transaction error:", err);
      setAlert({ type: "error", message: " Failed to create transaction." });
    } finally {
      setTimeout(() => setAlert({ type: "", message: "" }), 4000);
    }
  };

  // --- Filtered transaction list
  const filteredTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        const typeMatch = filter === "all" || t.type === filter;
        const categoryMatch =
          categoryFilter === "" ||
          (t.category &&
            t.category.toLowerCase().includes(categoryFilter.toLowerCase()));
        return typeMatch && categoryMatch;
      }),
    [transactions, filter, categoryFilter]
  );

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  // --- Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">
          Loading transactions...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900">Transaction Ledger</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <PieChartIcon className="w-5 h-5" />Home
          </button>
          <button
            onClick={() => navigate("/budget")}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <BarChart2 className="w-5 h-5" /> Budgets
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alert.message && (
        <div
          className={`p-4 rounded-xl font-semibold text-center ${
            alert.type === "error"
              ? "bg-red-100 text-red-700"
              : alert.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {alert.message}
        </div>
      )}
      {budgetAlert && (
        <div className="p-4 rounded-xl font-bold text-center bg-yellow-100 text-yellow-800 shadow-md animate-pulse">
          {budgetAlert}
        </div>
      )}

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TotalCard title="Total Income" amount={totalIncome} color="green" icon={TrendingUp} />
        <TotalCard title="Total Expenses" amount={totalExpense} color="red" icon={TrendingDown} />
      </div>

      {/* Form */}
      <form onSubmit={handleCreateTransaction} className="bg-white p-6 rounded-2xl shadow-xl mt-6 space-y-4">
        <h2 className="text-2xl font-bold flex items-center text-gray-800">
          <Plus className="w-6 h-6 mr-2 text-blue-600" /> Add Transaction
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            ref={categoryInputRef}
            type="text"
            placeholder="Category"
            value={newTransaction.category}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
            className="border rounded-xl p-3 col-span-2"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            className="border rounded-xl p-3"
          />
          <select
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
            className="border rounded-xl p-3"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            className="border rounded-xl p-3"
          />
        </div>

        {/* Inline Validation Messages */}
        {Object.keys(errors).length > 0 && (
          <ul className="text-sm text-red-600 font-medium list-disc pl-5">
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Add Transaction
        </button>
      </form>

      {/* Transactions Table */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>

          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 bg-gray-50"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="text"
              placeholder="Filter by category..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No transactions match your filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50 text-left uppercase text-xs tracking-wider text-gray-600">
                  <th className="p-3">Date</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((t) => (
                  <tr key={t._id} className="hover:bg-blue-50 transition">
                    <td className="p-3">{new Date(t.date || t.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 capitalize">{t.category}</td>
                    <td
                      className={`p-3 font-semibold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type}
                    </td>
                    <td className="p-3 text-right font-bold">{formatCurrency(t.amount)}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-red-500 hover:text-white hover:bg-red-600 p-2 rounded-full transition"
                        aria-label={`Delete ${t.category}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
