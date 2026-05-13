// =============================================
//  SpendWise - Transaction Form Component
//  Add income or expense transactions
// =============================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiCheck } from "react-icons/hi";
import { MdAttachMoney } from "react-icons/md";
import { addTransaction } from "../utils/api";

// Categories for income
const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business", "Investment", "Gift", "Bonus", "Other"
];

// Categories for expense
const EXPENSE_CATEGORIES = [
  "Food & Dining", "Transport", "Shopping", "Entertainment",
  "Healthcare", "Education", "Bills & Utilities", "Rent", "Groceries", "Other"
];

const TransactionForm = ({ onTransactionAdded }) => {
  // Form state
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Update form field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === "type" ? { category: "" } : {}),
    }));
    setError("");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.title || !form.amount || !form.category) {
      setError("Please fill in all fields.");
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addTransaction({
        ...form,
        amount: parseFloat(form.amount),
      });

      // Show success state
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      // Reset form
      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });

      // Notify parent to refresh data
      onTransactionAdded();
    } catch (err) {
      setError("Failed to add transaction. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const categories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isIncome = form.type === "income";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-bright rounded-2xl overflow-hidden"
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <MdAttachMoney className="text-cyan-400 text-xl" />
        </div>
        <div>
          <h3
            className="font-display font-semibold text-white text-base"
            style={{ letterSpacing: "-0.02em" }}
          >
            Add Transaction
          </h3>
          <p className="text-slate-500 text-xs">Record income or expense</p>
        </div>
      </div>

      <div className="p-6">
        {/* Type Toggle */}
        <div className="flex bg-slate-900/60 p-1 rounded-xl mb-5 border border-white/5">
          {["expense", "income"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                handleChange({ target: { name: "type", value: type } })
              }
              className="flex-1 py-2.5 rounded-lg text-sm font-body font-semibold capitalize transition-all duration-300 relative"
            >
              {form.type === type && (
                <motion.div
                  layoutId="type-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background:
                      type === "income"
                        ? "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))"
                        : "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))",
                    border: `1px solid ${type === "income" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  form.type === type
                    ? type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                    : "text-slate-500"
                }`}
              >
                {type === "income" ? "↑ Income" : "↓ Expense"}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-body text-slate-400 mb-1.5 tracking-wide uppercase">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={isIncome ? "e.g. Monthly Salary" : "e.g. Grocery Shopping"}
              className="input-field w-full px-4 py-3 rounded-xl text-sm font-body"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-body text-slate-400 mb-1.5 tracking-wide uppercase">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="input-field w-full pl-8 pr-4 py-3 rounded-xl text-sm font-amount"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-body text-slate-400 mb-1.5 tracking-wide uppercase">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-field w-full px-4 py-3 rounded-xl text-sm font-body appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-body text-slate-400 mb-1.5 tracking-wide uppercase">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="input-field w-full px-4 py-3 rounded-xl text-sm font-body"
            />
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-xl font-display font-semibold text-sm text-white flex items-center justify-center gap-2 mt-2 transition-all"
            style={{
              background: success
                ? "linear-gradient(135deg, #22C55E, #16A34A)"
                : isIncome
                ? "linear-gradient(135deg, #22C55E, #16A34A)"
                : "linear-gradient(135deg, #06B6D4, #0891B2)",
              boxShadow: success
                ? "0 0 30px rgba(34,197,94,0.4)"
                : isIncome
                ? "0 0 20px rgba(34,197,94,0.25)"
                : "0 0 20px rgba(6,182,212,0.25)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : success ? (
              <>
                <HiCheck className="text-lg" />
                Added!
              </>
            ) : (
              <>
                <HiPlus className="text-lg" />
                Add {isIncome ? "Income" : "Expense"}
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default TransactionForm;
