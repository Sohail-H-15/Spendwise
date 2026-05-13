// =============================================
//  SpendWise - Transaction Routes
//  GET, POST, DELETE for /api/transactions
// =============================================

const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// -----------------------------------------------
// GET /api/transactions
// Fetch all transactions (sorted newest first)
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// -----------------------------------------------
// POST /api/transactions
// Add a new transaction (income or expense)
// -----------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    // Create a new Transaction document using our model
    const newTransaction = new Transaction({
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
    });

    // Save it to MongoDB
    const saved = await newTransaction.save();
    res.status(201).json(saved); // 201 = Created
  } catch (error) {
    res.status(400).json({ message: "Validation error: " + error.message });
  }
});

// -----------------------------------------------
// DELETE /api/transactions/:id
// Delete a transaction by its MongoDB ID
// -----------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;
