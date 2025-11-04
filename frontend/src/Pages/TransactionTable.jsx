import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { transactionService, budgetService } from "../services/apiServices";
import {
  Plus,
  Trash2,
  Edit3,
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  Check,
  X,
} from "lucide-react";
import TotalCard from "../components/TotalCard";
import formatCurrency from "../Utils/formatCurrency";

const TransactionTable = () => {
  const navigate = useNavigate();
  const categoryInputRef = useRef(null);
  const tableRef = useRef(null); 

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [budgetAlert, setBudgetAlert] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    type: "expense",
    amount: "",
    description: "",
    date: new Date().toISOString().substring(0, 10),
  });
  const [errors, setErrors] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);

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
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await transactionService.delete(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      setAlert({ type: "success", message: "Transaction deleted successfully!" });
    } catch (err) {
      console.error("Delete error:", err);
      setAlert({ type: "error", message: "Failed to delete transaction." });
    } finally {
      setTimeout(() => setAlert({ type: "", message: "" }), 4000);
    }
  }, []);

  // --- Edit Transaction
  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditData({
      category: transaction.category,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date
        ? new Date(transaction.date).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      description: transaction.description || "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      const updated = await transactionService.update(id, editData);
      setTransactions((prev) =>
        prev.map((t) =>
          t._id === id ? updated.updated || updated.transaction || t : t
        )
      );
      setEditingId(null);
      setAlert({ type: "success", message: "Transaction updated successfully!" });
    } catch (err) {
      console.error("Update error:", err);
      setAlert({ type: "error", message: "Failed to update transaction." });
    } finally {
      setTimeout(() => setAlert({ type: "", message: "" }), 4000);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

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
  const emailUser = import.meta.env.VITE_EMAIL_USER;

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
    // Create transaction first
    const created = await transactionService.create({
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
    });

    setTransactions((prev) => [created.transaction, ...prev]);
    setAlert({ type: "success", message: "Transaction added successfully!" });

    //  Check budget limits
    const budgets = await budgetService.getAll();
    const category = newTransaction.category.toLowerCase();
    const budget = budgets.find((b) => b.category.toLowerCase() === category);

    if (budget) {
      const totalSpent =
        transactions
          .filter((t) => t.category?.toLowerCase() === category && t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0) +
        parseFloat(newTransaction.amount);

      if (totalSpent > budget.limit) {
        const overshoot = totalSpent - budget.limit;
        const alertMsg = `Budget exceeded for "${budget.category}" by ₦${overshoot.toLocaleString()}`;
        setBudgetAlert(alertMsg);
        setTimeout(() => setBudgetAlert(""), 6000);

        //  Send email via backend API (non-blocking)
        try {
          await fetch("/api/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: emailUser, 
              subject: "Budget Limit Exceeded",
              text: alertMsg,
            }),
          });
          console.log("Budget alert email sent successfully!");
        } catch (emailErr) {
          console.error("Error sending email:", emailErr);
        }
      }
    }

    //  Reset form
    setNewTransaction({
      category: "",
      type: "expense",
      amount: "",
      description: "",
      date: new Date().toISOString().substring(0, 10),
    });

    setShowCreateForm(false);
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } catch (err) {
    console.error("Create transaction error:", err);
    setAlert({ type: "error", message: "Failed to create transaction." });
  } finally {
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  }
};



  // --- Filtered transactions
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

  // --- Loading
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
            <PieChartIcon className="w-5 h-5" /> Home
          </button>
          <button
            onClick={() => navigate("/budget")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl shadow-md flex items-center gap-2 transition"
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

      {/* --- Toggleable Create Form */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mt-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-xl shadow-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showCreateForm ? "Hide Form" : "Add New Transaction"}
        </button>

        {showCreateForm && (
          <form
            onSubmit={handleCreateTransaction}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end mt-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                ref={categoryInputRef}
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
                className="border p-2 rounded-md w-full"
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, category: e.target.value })
                }
                className="border p-2 rounded-md w-full"
              />
              {errors.category && (
                <p className="text-red-500 text-xs">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, type: e.target.value })
                }
                className="border p-2 rounded-md w-full"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, amount: e.target.value })
                }
                className="border p-2 rounded-md w-full"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, description: e.target.value })
                }
                className="border p-2 rounded-md w-full"
              />
            </div>

            <div>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-xl shadow-md hover:bg-green-700 w-full flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </form>
        )}
      </div>

      {/* --- Transactions Table --- */}
      <div ref={tableRef} className="bg-white shadow-xl rounded-2xl p-6 mt-6">
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
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((t) => (
                  <tr key={t._id} className="hover:bg-blue-50 transition">
                    {editingId === t._id ? (
                      <>
                        <td className="p-3">
                          <input
                            type="date"
                            value={editData.date}
                            onChange={(e) =>
                              setEditData({ ...editData, date: e.target.value })
                            }
                            className="border p-1 rounded-md"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={editData.category}
                            onChange={(e) =>
                              setEditData({ ...editData, category: e.target.value })
                            }
                            className="border p-1 rounded-md"
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={editData.type}
                            onChange={(e) =>
                              setEditData({ ...editData, type: e.target.value })
                            }
                            className="border p-1 rounded-md"
                          >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            value={editData.amount}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                amount: e.target.value,
                              })
                            }
                            className="border p-1 rounded-md text-right"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={editData.description}
                            onChange={(e) =>
                              setEditData({ ...editData, description: e.target.value })
                            }
                            className="border p-1 rounded-md w-full"
                          />
                        </td>
                        <td className="p-3 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleUpdate(t._id)}
                            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3">
                          {new Date(t.date || t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 capitalize">{t.category}</td>
                        <td
                          className={`p-3 font-semibold ${
                            t.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {t.type}
                        </td>
                        <td className="p-3 text-right font-bold">
                          {formatCurrency(t.amount)}
                        </td>
                        <td className="p-3">{t.description}</td>
                        <td className="p-3 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(t)}
                            className="text-blue-500 hover:text-white hover:bg-blue-600 p-2 rounded-full transition"
                            aria-label={`Edit ${t.category}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="text-red-500 hover:text-white hover:bg-red-600 p-2 rounded-full transition"
                            aria-label={`Delete ${t.category}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    )}
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
