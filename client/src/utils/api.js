// =============================================
//  SpendWise - API utility (Axios)
//  All backend calls go through this file
// =============================================

import axios from "axios";

// Base URL for all API calls
// The "proxy" in package.json forwards /api → http://localhost:5000
const API = axios.create({
  baseURL: "/api",
});

// Fetch all transactions
export const getTransactions = () => API.get("/transactions");

// Add a new transaction
export const addTransaction = (data) => API.post("/transactions", data);

// Delete a transaction by ID
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
