import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BudgetProgress from "../components/BudgetProgress";
import TotalCard from "../components/TotalCard";
import MonthlyTrend from "../components/MonthlyTrend";
import { authService, transactionService, budgetService } from "../services/apiServices";
import {
  Pencil,
  User,
  Wallet,
  LogOut,
  DollarSign,
  TrendingUp,
  Gauge,
  X,
  CreditCard,
  PlusCircle,
  BarChart2,
} from "lucide-react";

// --- Constants ---
const INITIAL_SUMMARY_STATE = {
  totalIncome: 0,
  balance: 0,
  monthlyBreakdown: [],
  expensesByCategory: [],
};

// --- Helper Components ---



const EditProfileModal = ({ editMode, setEditMode, form, setForm, handleUpdateProfile, alert }) => {
  const handleChange = useCallback(
    (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    [setForm]
  );

  if (!editMode) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative transform transition-all duration-300 scale-100 opacity-100">
        
        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-3">
          <Pencil className="w-6 h-6 text-indigo-600" /> Update Account Info
        </h2>

        {/* Alert Messaging */}
        {alert && (
          <div
            className={`p-3 mb-4 rounded-xl font-semibold text-center text-sm ${
              alert.includes("successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
            role="alert"
          >
            {alert}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field === "phone" ? "Optional Phone Number" : `Enter your ${field}`}
                className="w-full border border-gray-200 rounded-xl p-3 placeholder:text-gray-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition duration-150"
                required={field !== "phone"}
              />
            </div>
          ))}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/30 transition duration-150"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={() => setEditMode(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};


// Profile Card
 
 
const ProfileCard = ({ user, setEditMode, handleLogout }) => (
  <div className="bg-white shadow-xl hover:shadow-2xl rounded-3xl p-6 lg:p-8 transition duration-300 border-t-8 border-indigo-600">
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-50 text-indigo-700 p-3 rounded-full flex justify-center items-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name || "Finance Manager"}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
    
    <div className="space-y-3">
      <button
        onClick={() => setEditMode(true)}
        className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition duration-150"
      >
        <Pencil className="w-4 h-4" /> Edit Profile Details
      </button>
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition duration-150"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  </div>
);

  // Quick Actions Card

const QuickActionsCard = ({ navigate }) => (
    <div className="bg-white shadow-xl rounded-3xl p-6 lg:p-8 border-t-8 border-green-600">
        <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-green-600" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
            {[
                { label: "New Transaction", icon: CreditCard, path: "/transactionTable", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Set Budget", icon: DollarSign, path: "/budget", color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "View Reports", icon: BarChart2, path: "/reports", color: "text-purple-600", bg: "bg-purple-50" },
                { label: "View All", icon: Wallet, path: "/transactionTable", color: "text-orange-600", bg: "bg-orange-50" },
            ].map((action) => (
                <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className={`p-4 rounded-xl text-center transition-all duration-200 transform hover:scale-[1.05] shadow-md hover:shadow-lg ${action.bg}`}
                >
                    <action.icon className={`w-6 h-6 mx-auto mb-1 ${action.color}`} />
                    <span className="text-xs font-semibold text-gray-700">{action.label}</span>
                </button>
            ))}
        </div>
    </div>
);

// --- Dashboard Component ---

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [summaryData, setSummaryData] = useState(INITIAL_SUMMARY_STATE);
  const [activeBudgets, setActiveBudgets] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardAlert, setDashboardAlert] = useState("");

  const initializeProfileForm = useCallback((userData) => {
    setProfileForm({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
    });
  }, []);

  // Fetch all data (no changes needed to logic, just styling)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileResponse, summaryResult, budgetResult, allTransactionsResponse] =
          await Promise.all([
            authService.getProfile(),
            transactionService.getSummary(),
            budgetService.getAll(),
            transactionService.getAll(),
          ]);

        const userData = profileResponse.user || profileResponse;
        setProfile(userData);
        initializeProfileForm(userData);

        setSummaryData({ ...INITIAL_SUMMARY_STATE, ...summaryResult });
        setAllTransactions(
          Array.isArray(allTransactionsResponse?.transactions)
            ? allTransactionsResponse.transactions
            : allTransactionsResponse
        );
        setActiveBudgets(
          Array.isArray(budgetResult?.budgets) ? budgetResult.budgets : budgetResult
        );
      } catch (error) {
        console.error("Error loading dashboard:", error);
        if (error?.response?.status === 401) {
          navigate("/login");
        }
        setDashboardAlert("Failed to load dashboard data. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate, initializeProfileForm]);

  // Budgets with spending (logic unchanged)
  const budgetsWithSpending = useMemo(() => {
    if (!activeBudgets.length || !allTransactions.length) return [];
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthlySpending = allTransactions
      .filter((t) => t.type === "expense" && (t.date || t.createdAt)?.startsWith(currentMonth))
      .reduce((acc, t) => {
        const key = t.category?.toLowerCase() || "uncategorized";
        acc[key] = (acc[key] || 0) + t.amount;
        return acc;
      }, {});
    return activeBudgets.map((b) => ({
      ...b,
      currentSpend: monthlySpending[b.category?.toLowerCase()] || 0,
    }));
  }, [allTransactions, activeBudgets]);

  // Profile update 
  const handleUpdateProfile = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const updatedUser = await authService.updateProfile(profileForm);
        setProfile(updatedUser);
        setDashboardAlert("Profile updated successfully! 🎉");
        setTimeout(() => setIsEditMode(false), 1500);
      } catch (error) {
        console.error("Update profile error:", error);
        setDashboardAlert("Failed to update profile.");
      }
    },
    [profileForm]
  );

  const handleLogout = useCallback(() => {
    authService.logout();
    navigate("/login");
  }, [navigate]);

  const firstName = profile?.name?.split(" ")[0] || "User";

  // Loading State 
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-2xl font-extrabold text-indigo-600 flex items-center gap-4 p-6 bg-white rounded-xl shadow-xl">
          <Gauge className="w-8 h-8 animate-spin" /> Loading Dashboard Data...
        </p>
      </div>
    );

  // --- Main Render ---
  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto  min-h-screen space-y-10">
      
      <EditProfileModal
        editMode={isEditMode}
        setEditMode={setIsEditMode}
        form={profileForm}
        setForm={setProfileForm}
        handleUpdateProfile={handleUpdateProfile}
        alert={dashboardAlert}
      />

      {/*  Header & Main CTA */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b-4 border-indigo-100">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Welcome back, <span className="text-indigo-600">{firstName}</span>!
          </h1>
          <p className="text-lg text-gray-500 mt-1">Your financial summary at a glance.</p>
        </div>
       
        <button
          onClick={() => navigate("/transactionTable")}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl flex items-center gap-2 font-bold shadow-xl shadow-green-500/30 transition transform hover:scale-[1.02]"
        >
          <PlusCircle className="w-5 h-5" /> Add New Transaction
        </button>
      </header>
      
      {/* --- Main Grid: Summary & Profile/Quick Actions --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Summary Cards - Span 2/3 of the width */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TotalCard title="Total Income (MoM)" amount={summaryData.totalIncome} color="income" icon={TrendingUp} />
          <TotalCard title="Net Balance" amount={summaryData.balance} color="balance" icon={Wallet} />
          <TotalCard title="Total Expenses (MoM)" amount={summaryData.totalIncome - summaryData.balance} color="expense" icon={DollarSign} />
          <TotalCard title="Savings Rate" amount={Math.round((summaryData.balance / summaryData.totalIncome) * 100) || 0} unit="%" color="savings" icon={Gauge} />
        </div>
        
        {/* Right Sidebar - Profile and Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickActionsCard navigate={navigate} />
            <ProfileCard user={profile} setEditMode={setIsEditMode} handleLogout={handleLogout} />
        </div>
      </div>
      
      {/* --- Charts & Budgets --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monthly Trend Chart - Span 2/3 of the width */}
        <div className="lg:col-span-2">
            <MonthlyTrend />
        </div>
        
        {/* Budget Performance */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border-t-8 border-orange-500 min-h-[400px]">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
            <Gauge className="w-6 h-6 text-orange-600" /> Budget Performance
          </h2>
          {budgetsWithSpending.length ? (
            <div className="space-y-5">
              {budgetsWithSpending.slice(0, 4).map((b) => (
               
                <BudgetProgress 
                    key={b._id} 
                    name={b.category} 
                    spent={b.currentSpend} 
                    limit={b.limit} 
                    color={b.currentSpend > b.limit ? "red" : "indigo"} 
                />
              ))}
              {budgetsWithSpending.length > 4 && (
                <button
                  onClick={() => navigate("/budget")}
                  className="w-full mt-3 py-3 bg-orange-50 text-orange-700 font-bold rounded-xl hover:bg-orange-100 transition duration-150"
                >
                  View All {budgetsWithSpending.length} Budgets →
                </button>
              )}
            </div>
          ) : (
            <div className="text-center bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-xl min-h-[400px] flex flex-col justify-center items-center">
              <DollarSign className="w-10 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-800 mb-3">No Budgets Set</p>
              <p className="text-gray-500 mb-6">Start by setting a limit to control your spending!</p>
              <button
                onClick={() => navigate("/budget")}
                className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition duration-150"
              >
                Set Up Your First Budget
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;