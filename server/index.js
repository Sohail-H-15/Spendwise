// =============================================
//  SpendWise - Express Server (index.js)
//  Simple beginner-friendly MERN backend
// =============================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---- Middleware ----
app.use(cors()); // Allow requests from React frontend
app.use(express.json()); // Parse incoming JSON bodies

// ---- Import Routes ----
const transactionRoutes = require("./routes/transactions");
const authRoutes = require("./routes/auth");

// ---- Use Routes ----
// All transaction API routes are prefixed with /api/transactions
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);

// ---- Root Route (health check) ----
app.get("/", (req, res) => {
  res.json({ message: "SpendWise API is running 🚀" });
});

// ---- Connect to MongoDB and Start Server ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/spendwise";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });
