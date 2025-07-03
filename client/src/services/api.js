import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://finance-tracker-server-pgut.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// Expenses
export const addExpense = (data) => API.post("/expenses", data);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const getExpenses = () => API.get("/expenses");

// Budgets
export const setBudget = (data) => API.post("/budgets", data);
export const getBudgets = (userId) => API.get(`/budgets/${userId}`);
export const deleteBudget = (id) => API.delete(`/budgets/${id}`);

// Alerts
export const getAlerts = (userId, month) =>
  API.get(`/budgets/alerts?userId=${userId}&month=${month}`);

//Dashboard
export const getDashboardData = (userId, month) =>
  API.get(`/dashboard/${userId}?month=${month}`);
