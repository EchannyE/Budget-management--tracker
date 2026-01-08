import { useEffect, useState, useCallback, useRef } from "react";
import { transactionService, budgetService } from "../services/apiServices";
import {
    Pencil,
    Trash2,
    Check,
    X,
    Loader2,
    DollarSign,
    AlertTriangle,
} from "lucide-react";
import BudgetProgress from "../components/BudgetProgress"; 

// --- Validation Function ---
const isValidBudget = (category, limit) => {
    if (!category || category.trim() === "") return "Category cannot be empty.";
    const numericLimit = Number(limit);
    if (isNaN(numericLimit) || numericLimit <= 0)
        return "Budget limit must be a positive number.";
    return null;
};

// --- Budget Component ---

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newLimit, setNewLimit] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState(null);
    const [spending, setSpending] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editLimit, setEditLimit] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null);
    const editInputRef = useRef(null);

    
    const fetchBudgets = useCallback(async () => {
        setLoading(true);
        setAlert(null);
        try {
            const [budgetRes, txRes] = await Promise.all([
                budgetService.getAll(),
                transactionService.getAll(),
            ]);

            const budgetData = Array.isArray(budgetRes)
                ? budgetRes
                : budgetRes?.budgets || [];
            const transactions = Array.isArray(txRes)
                ? txRes
                : txRes?.transactions || [];

            // Calculate spending for the current month
            const spendingData = {};
            const month = new Date().toISOString().slice(0, 7);

            transactions
                .filter(
                    (t) => t.type === "expense" && (t.date || t.createdAt)?.slice(0, 7) === month
                )
                .forEach((t) => {
                    const key = t.category?.toLowerCase() || "uncategorized";
                    spendingData[key] = (spendingData[key] || 0) + Number(t.amount || 0);
                });

            setBudgets(budgetData);
            setSpending(spendingData);
        } catch (err) {
            console.error("Fetch error:", err);
            setAlert({ type: "error", message: " Failed to load budgets. Please try refreshing." });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    // --- Event Handlers ---
    const cancelEdit = () => {
        setEditingId(null);
        setEditLimit("");
        setAlert(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert(null);
        setIsSubmitting(true);

        const validation = isValidBudget(newCategory, newLimit);
        if (validation) {
            setAlert({ type: "error", message: ` ${validation}` });
            setIsSubmitting(false);
            return;
        }

        if (
            budgets.some(
                (b) => b.category.toLowerCase() === newCategory.toLowerCase().trim()
            )
        ) {
            setAlert({
                type: "error",
                message: ` A budget for '${newCategory}' already exists.`,
            });
            setIsSubmitting(false);
            return;
        }

        try {
            await budgetService.create({
                category: newCategory.trim(),
                limit: Number(newLimit),
            });
            setAlert({ type: "success", message: " Budget added successfully!" });
            setNewCategory("");
            setNewLimit("");
            fetchBudgets();
        } catch (err) {
            console.error(err);
            setAlert({ type: "error", message: " Failed to save budget." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (b) => {
        setAlert(null);
        setEditingId(b._id);
        setEditLimit(String(b.limit));
        setTimeout(() => editInputRef.current?.focus(), 100);
    };

    const saveEdit = async (id) => {
        setAlert(null);
        
        const numericLimit = Number(editLimit);
        if (isNaN(numericLimit) || numericLimit <= 0) {
            setAlert({ type: "error", message: "❌ Please enter a valid positive number for the budget limit." });
            return;
        }

        const currentBudget = budgets.find((b) => b._id === id);
        if (currentBudget && Number(currentBudget.limit) === numericLimit) {
            setAlert({ type: "info", message: "ℹNo changes detected in the budget limit." });
            cancelEdit();
            return;
        }
        
        setAlert({ type: "info", message: "⏳ Updating budget..." });

        try {
            const response = await budgetService.update(id, { limit: numericLimit });

            if (response && response._id) {
                setBudgets((prev) =>
                    prev.map((b) => (b._id === id ? { ...b, limit: response.limit } : b))
                );
            } else {
                
                await fetchBudgets();
            }

            setAlert({ type: "success", message: " Budget limit updated successfully!" });
            cancelEdit();
        } catch (err) {
            console.error("Budget update error:", err);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "An unexpected error occurred while updating the budget.";
            setAlert({ type: "error", message: `❌ Failed to update budget. ${msg}` });
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await budgetService.delete(confirmDelete);
            setAlert({ type: "success", message: "🗑️ Deleted successfully!" });
            setConfirmDelete(null);
            fetchBudgets();
        } catch {
            setAlert({ type: "error", message: "❌ Failed to delete budget." });
        }
    };
    

    if (loading)
        return (
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-xl m-10 shadow-lg">
                <Loader2 className="animate-spin text-blue-600 w-8 h-8 mr-3" />
                <p className="font-semibold text-xl text-blue-700">Loading budgets...</p>
            </div>
        );

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border-t-4 border-blue-600 p-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                    <DollarSign className="text-blue-600 w-7 h-7" /> Budget Management
                </h1>

                {/* Global Alert */}
                {alert && (
                    <div
                        className={`p-4 mb-6 rounded-xl shadow-md font-medium transition-opacity duration-300 ${
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

                {/* New Budget Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 mb-8"
                >
                    <input
                        type="text"
                        placeholder="Category (e.g. Groceries)"
                        className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 transition"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        disabled={isSubmitting}
                        aria-label="New budget category"
                    />
                    <input
                        type="number"
                        placeholder="Limit (₦)"
                        className="border border-blue-200 rounded-lg p-3 w-full md:w-44 focus:ring-2 focus:ring-blue-400 transition"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                        disabled={isSubmitting}
                        min="0.01"
                        step="0.01"
                        aria-label="New budget limit"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Budget"}
                    </button>
                </form>

                {/* Budget Cards */}
                <div className="space-y-5">
                    {budgets.length === 0 ? (
                        <div className="text-gray-500 text-center py-10 border-dashed border-2 rounded-xl">
                            <p className="text-lg font-medium">No budgets set yet. Start by creating one above! </p>
                        </div>
                    ) : (
                        budgets.map((b) => {
                            const spent = spending[b.category?.toLowerCase()] || 0;
                            const exceeded = spent > b.limit;

                            return (
                                <div
                                    key={b._id}
                                    className="p-5 rounded-xl shadow-lg transition-all border-l-8 border-transparent bg-white hover:shadow-xl" 
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        
                                        <h2 className="text-xl font-bold text-gray-900 capitalize">
                                            {b.category}
                                        </h2>
                                        
                                        {/* Edit/Action Controls (KEPT) */}
                                        {editingId === b._id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    ref={editInputRef}
                                                    type="number"
                                                    className="border border-blue-300 rounded-lg p-2 w-28 text-right font-medium focus:ring-1 focus:ring-blue-500"
                                                    value={editLimit}
                                                    onChange={(e) => setEditLimit(e.target.value)}
                                                    min="0.01"
                                                    step="0.01"
                                                    aria-label={`Edit limit for ${b.category}`}
                                                />
                                                <button
                                                    onClick={() => saveEdit(b._id)}
                                                    className="bg-green-100 text-green-700 hover:bg-green-200 rounded-full p-2 transition"
                                                    aria-label="Save changes"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-red-100 text-red-700 hover:bg-red-200 rounded-full p-2 transition"
                                                    aria-label="Cancel editing"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 text-gray-500">
                                                <button
                                                    onClick={() => startEdit(b)}
                                                    className="hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
                                                    aria-label="Edit budget limit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(b._id)}
                                                    className="hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                                                    aria-label="Delete budget"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <BudgetProgress                  
                                        name={b.category} 
                                        spent={spent}
                                        limit={b.limit}
                                        exceeded={exceeded}
                                    />

                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Confirm Delete Modal (Unchanged) */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center transform transition-all">
                        <AlertTriangle className="text-red-600 w-12 h-12 mx-auto mb-4 animate-pulse" />
                        <h3 className="text-2xl font-extrabold text-gray-800 mb-2">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            This action is permanent. Are you absolutely sure you want to delete this budget?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition shadow-lg"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-medium transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Budget;