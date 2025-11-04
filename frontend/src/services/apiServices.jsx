import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'; 

// Create Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


//  AUTH SERVICE 
export const authService = {
  register: async (userData) => {
    const res = await api.post("/auth/register", userData);
    return res.data;
  },

  login: async (userData) => {
    const res = await api.post("/auth/login", userData);
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get("/dashboard");
    return res.data;
  },

  updateProfile: async (updates) => {
    const res = await api.put("/dashboard", updates);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

// EMAIL SERVICE 

export const emailService = {
  sendEmail: async (to, subject, message) => {
    const res = await api.post("/email/send", { to, subject, message });
    return res.data;
  },
};


//  TRANSACTION SERVICE 

export const transactionService = {
  getAll: async () => {
    const res = await api.get("/transaction");
    return res.data;
  },


  create: async (transactionData) => {
    const res = await api.post("/transaction", transactionData);
    return res.data;
  },

  getSummary: async () => {
    const res = await api.get("/transaction/summary");
    return res.data;
  },

  getInsights: async () => {
    const res = await api.get("/transaction/insights");
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/transaction/${id}`);
    return res.data;
  },

  update: async (id, updates) => {
    const res = await api.put(`/transaction/${id}`, updates);
    return res.data;
  },
};

//  BUDGET SERVICE 

export const budgetService = {
  getAll: async () => {
    const res = await api.get("/budget/all");
    return res.data;
  },

  create: async (budgetData) => {
    const res = await api.post("/budget/set", budgetData);
    return res.data;
  },

  addExpense: async (expenseData) => {
    const res = await api.post("/budget", expenseData);
    return res.data;
  },

  update: async (id, updates) => {
    const res = await api.put(`/budget/${id}`, updates);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/budget/${id}`);
    return res.data;
  },
};


//  STATS SERVICE 

export const statsService = {
  getMonthlyStats: async () => {
    const res = await api.get("/stats/monthly");
    return res.data;
  },

  
};


export default {
  authService,
  emailService,
  transactionService,
  budgetService,
  statsService,
};
