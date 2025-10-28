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
} from "lucide-react";

const INITIAL_SUMMARY_STATE = {
  totalIncome: 0,
  balance: 0,
  monthlyBreakdown: [],
  expensesByCategory: [],
};

// Edit Profile Modal
const EditProfileModal = ({ editMode, setEditMode, form, setForm, handleUpdateProfile, alert }) => {
  const handleChange = useCallback(
    (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    [setForm]
  );

  if (!editMode) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Pencil className="w-6 h-6 text-indigo-600" /> Edit Profile
        </h2>

        {alert && (
          <div
            className={`p-3 mb-4 rounded-xl font-medium text-center ${
              alert.includes("successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
            role="alert"
          >
            {alert}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field === "phone" ? "Optional Phone Number" : ""}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required={field !== "phone"}
              />
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>

        <button
          onClick={() => setEditMode(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

//  Profile Card
const ProfileCard = ({ user, setEditMode, handleLogout }) => (
  <div className="bg-white shadow-lg hover:shadow-2xl rounded-2xl p-6 border-t-4 border-indigo-500 text-center">
    <div className="bg-indigo-100 text-indigo-700 p-5 rounded-full mb-4 mx-auto w-fit flex justify-center items-center">
      <User className="w-8 h-8" />
    </div>
    <h2 className="text-xl font-bold text-gray-800">{user.name || "N/A"}</h2>
    <p className="text-sm text-gray-500 mb-4">{user.email}</p>
    <div className="flex justify-center gap-3 mt-2">
      <button
        onClick={() => setEditMode(true)}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl text-sm font-medium flex items-center gap-1"
      >
        <Pencil className="w-4 h-4" /> Edit
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl text-sm font-medium flex items-center gap-1"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  </div>
);

// Dashboard Component
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

  //  Fetch all data
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
        setDashboardAlert("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate, initializeProfileForm]);

  // Budgets with spending
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
        setDashboardAlert("Profile updated successfully!");
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-bold text-indigo-600 flex items-center gap-3">
          <Gauge className="w-8 h-8 animate-spin" /> Loading Dashboard...
        </p>
      </div>
    );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto bg-gray-50 min-h-screen space-y-8">
      <EditProfileModal
        editMode={isEditMode}
        setEditMode={setIsEditMode}
        form={profileForm}
        setForm={setProfileForm}
        handleUpdateProfile={handleUpdateProfile}
        alert={dashboardAlert}
      />

      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Hello, <span className="text-indigo-600">{firstName}</span> 
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/budget")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl flex items-center gap-2 font-bold shadow-xl"
          >
            <DollarSign className="w-5 h-5" /> Set Budget
          </button>
          <button
            onClick={() => navigate("/transactionTable")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl flex items-center gap-2 font-medium"
          >
            <Wallet className="w-5 h-5" /> View Transactions
          </button>
        </div>
      </header>

      {/* Summary + Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TotalCard title="Total Income" amount={summaryData.totalIncome} color="income" icon={TrendingUp} />
          <TotalCard title="Net Balance" amount={summaryData.balance} color="balance" icon={Wallet} />
        </div>
        <ProfileCard user={profile} setEditMode={setIsEditMode} handleLogout={handleLogout} />
      </div>

      {/* Trends + Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlyTrend />
        <div className="bg-white shadow-xl rounded-3xl p-6 border-t-8 border-orange-500">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
            <Gauge className="w-6 h-6 text-orange-600" /> Budget Performance
          </h2>
          {budgetsWithSpending.length ? (
            <div className="space-y-5">
              {budgetsWithSpending.slice(0, 3).map((b) => (
                <BudgetProgress key={b._id} name={b.category} spent={b.currentSpend} limit={b.limit} />
              ))}
              {budgetsWithSpending.length > 3 && (
                <button
                  onClick={() => navigate("/budget")}
                  className="w-full mt-3 py-2 bg-orange-50 text-orange-700 font-semibold rounded-xl hover:bg-orange-100"
                >
                  View All Budgets →
                </button>
              )}
            </div>
          ) : (
            <div className="text-center bg-gray-50 border-2 border-dashed p-8 rounded-xl">
              <DollarSign className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <p className="text-lg font-semibold text-gray-700 mb-3">No Active Budgets Found</p>
              <button
                onClick={() => navigate("/budget")}
                className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-xl font-bold shadow-lg"
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
