// =============================================
//  SpendWise - Transaction History Component
//  Lists all transactions with delete option
// =============================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiTrash, HiArrowUp, HiArrowDown } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { deleteTransaction } from "../utils/api";

// Map categories to emojis for visual flair
const CATEGORY_EMOJI = {
  "Salary": "💼",
  "Freelance": "💻",
  "Business": "🏢",
  "Investment": "📈",
  "Gift": "🎁",
  "Bonus": "🎯",
  "Food & Dining": "🍔",
  "Transport": "🚗",
  "Shopping": "🛍️",
  "Entertainment": "🎬",
  "Healthcare": "🏥",
  "Education": "📚",
  "Bills & Utilities": "⚡",
  "Rent": "🏠",
  "Groceries": "🛒",
  "Other": "📌",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TransactionList = ({ transactions, onDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Filter transactions
  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      onDeleted();
    } catch (err) {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-bright rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <MdHistory className="text-cyan-400 text-xl" />
          </div>
          <div>
            <h3
              className="font-display font-semibold text-white text-base"
              style={{ letterSpacing: "-0.02em" }}
            >
              Transaction History
            </h3>
            <p className="text-slate-500 text-xs">{filtered.length} records</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-900/60 p-1 rounded-lg border border-white/5 gap-1">
          {["all", "income", "expense"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-body font-medium capitalize transition-all duration-200 ${
                filter === f
                  ? f === "income"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : f === "expense"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "480px" }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-slate-600"
            >
              <div className="text-5xl mb-4">📊</div>
              <p className="font-body text-sm">No transactions yet</p>
              <p className="font-body text-xs text-slate-700 mt-1">
                Add your first transaction above
              </p>
            </motion.div>
          ) : (
            filtered.map((txn, i) => (
              <motion.div
                key={txn._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3, delay: i < 10 ? i * 0.04 : 0 }}
                className="transaction-item flex items-center gap-4 px-6 py-4 border-b border-white/4 group"
                style={{
                  borderLeft: `3px solid ${
                    txn.type === "income"
                      ? "rgba(34,197,94,0.4)"
                      : "rgba(239,68,68,0.4)"
                  }`,
                }}
              >
                {/* Category Emoji + Type Icon */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{
                      background:
                        txn.type === "income"
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(239,68,68,0.1)",
                      border: `1px solid ${
                        txn.type === "income"
                          ? "rgba(34,197,94,0.2)"
                          : "rgba(239,68,68,0.2)"
                      }`,
                    }}
                  >
                    {CATEGORY_EMOJI[txn.category] || "📌"}
                  </div>
                  {/* Income/Expense arrow badge */}
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                      txn.type === "income" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {txn.type === "income" ? (
                      <HiArrowUp className="text-white text-[8px]" />
                    ) : (
                      <HiArrowDown className="text-white text-[8px]" />
                    )}
                  </div>
                </div>

                {/* Title + category + date */}
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-slate-200 text-sm truncate">
                    {txn.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-slate-500 text-xs">{txn.category}</span>
                    <span className="text-slate-700 text-xs">•</span>
                    <span className="text-slate-600 text-xs">
                      {formatDate(txn.date)}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p
                    className={`font-amount font-semibold text-sm ${
                      txn.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {txn.type === "income" ? "+" : "-"}
                    {formatCurrency(txn.amount)}
                  </p>
                </div>

                {/* Delete Button */}
                <motion.button
                  onClick={() => handleDelete(txn._id)}
                  disabled={deletingId === txn._id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10"
                >
                  {deletingId === txn._id ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full"
                    />
                  ) : (
                    <HiTrash className="text-base" />
                  )}
                </motion.button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TransactionList;
