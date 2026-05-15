// =============================================
//  SpendWise - API utility (Axios)
//  All backend calls go through this file
// =============================================

import axios from "axios";

// Base URL for all API calls
// The "proxy" in package.json forwards /api → http://localhost:5000
// Use the environment variable if available (for production/Render), otherwise fallback to '/api' (for local proxy)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

// Add auth token to requests
API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers["x-auth-token"] = localStorage.getItem("token");
  }
  return req;
});

// Fetch all transactions
export const getTransactions = () => API.get("/transactions");

// Add a new transaction
export const addTransaction = (data) => API.post("/transactions", data);

// Update a transaction
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);

// Delete a transaction by ID
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// Insights
export const getInsights = () => API.get("/transactions/insights/complex");
