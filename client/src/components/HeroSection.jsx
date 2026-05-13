// =============================================
//  SpendWise - Hero Section Component
//  Large animated balance display at top
// =============================================

import React from "react";
import { motion } from "framer-motion";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const HeroSection = ({ transactions }) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const isPositive = balance >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative text-center py-8 lg:py-12 overflow-hidden"
    >
      {/* Decorative glowing orbs */}
      <div
        className="orb w-96 h-96 -top-24 left-1/2 -translate-x-1/2"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.6), transparent)", opacity: 0.08 }}
      />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <div className="w-2 h-2 bg-cyan-400 rounded-full ping-slow" />
        <span className="text-slate-400 text-sm font-body tracking-[0.2em] uppercase">
          Current Balance
        </span>
      </motion.div>

      {/* Huge Balance Number */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight mb-4 ${
          isPositive ? "text-white" : "text-red-400"
        }`}
        style={{
          letterSpacing: "-0.04em",
          textShadow: isPositive
            ? "0 0 60px rgba(6,182,212,0.2)"
            : "0 0 60px rgba(239,68,68,0.2)",
        }}
      >
        {formatCurrency(balance)}
      </motion.div>

      {/* Status pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium border ${
          isPositive
            ? "text-green-400 border-green-500/20 bg-green-500/5"
            : "text-red-400 border-red-500/20 bg-red-500/5"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isPositive ? "bg-green-400" : "bg-red-400"}`} />
        {transactions.length === 0
          ? "No transactions yet — get started!"
          : isPositive
          ? "You're in great financial shape 🎉"
          : "Over budget — time to cut back ⚠️"}
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
