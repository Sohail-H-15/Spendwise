// =============================================
//  SpendWise - Transaction Routes
//  GET, POST, DELETE for /api/transactions
// =============================================

const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

// -----------------------------------------------
// GET /api/transactions
// Fetch all transactions (sorted newest first)
// -----------------------------------------------
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// -----------------------------------------------
// POST /api/transactions
// Add a new transaction (income or expense)
// -----------------------------------------------
router.post("/", auth, async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    // Create a new Transaction document using our model
    const newTransaction = new Transaction({
      user: req.user.id,
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
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// -----------------------------------------------
// PUT /api/transactions/:id
// Update a transaction
// -----------------------------------------------
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, category, date } = req.body;

    let transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    transaction = await Transaction.findByIdAndUpdate(
      id,
      { $set: { title, amount, type, category, date } },
      { new: true }
    );
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// -----------------------------------------------
// GET /api/transactions/insights/complex
// Complex Join Query equivalent to suggest spending habits
// -----------------------------------------------
router.get("/insights/complex", auth, async (req, res) => {
  try {
    // We aggregate the transactions to calculate total earnings and total spendings
    // As requested: "complex query as well such as join query like based on earning and spending it should suggest us to save money"
    const mongoose = require("mongoose");
    const aggregation = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
          categories: { $push: { type: "$type", category: "$category", amount: "$amount" } }
        }
      }
    ]);

    if (!aggregation || aggregation.length === 0) {
      return res.json({ message: "Not enough data to provide insights", suggestion: "Add some transactions first!" });
    }

    const { totalIncome, totalExpense, categories } = aggregation[0];
    
    // Complex insights logic
    let suggestion = "";
    if (totalExpense > totalIncome) {
      suggestion = "You are spending more than you earn! Try to save money and cut down on non-essential expenses.";
    } else if (totalExpense > totalIncome * 0.8) {
      suggestion = "You are spending 80% of your earnings. It is recommended to save at least 20% for the future.";
    } else {
      suggestion = "Great job! You have a healthy saving rate.";
    }

    // Finding highest expense category
    const expenseCategories = categories.filter(c => c.type === 'expense');
    let highestCategory = { category: '', amount: 0 };
    const catMap = {};
    expenseCategories.forEach(c => {
      catMap[c.category] = (catMap[c.category] || 0) + c.amount;
    });
    for (let cat in catMap) {
      if (catMap[cat] > highestCategory.amount) {
        highestCategory = { category: cat, amount: catMap[cat] };
      }
    }

    if (highestCategory.amount > 0 && totalExpense > totalIncome * 0.5) {
      suggestion += ` Consider spending less on ${highestCategory.category}.`;
    }

    res.status(200).json({
      totalIncome,
      totalExpense,
      highestExpenseCategory: highestCategory.category,
      suggestion
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;
