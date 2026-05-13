// =============================================
//  SpendWise - Summary Cards Component
//  Shows Balance, Income, Expenses
// =============================================

import React from "react";
import { motion } from "framer-motion";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdAccountBalanceWallet } from "react-icons/md";

// Format number to currency string
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const SummaryCards = ({ transactions }) => {
  // Calculate totals from all transactions
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Card configurations
  const cards = [
    {
      label: "Total Balance",
      value: formatCurrency(balance),
      icon: <MdAccountBalanceWallet className="text-2xl" />,
      color: "cyan",
      glowColor: "rgba(6,182,212,0.3)",
      borderColor: "rgba(6,182,212,0.2)",
      textColor: "text-cyan-400",
      bgGradient: "from-cyan-500/10 to-transparent",
      isBalance: true,
    },
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      icon: <HiTrendingUp className="text-2xl" />,
      color: "green",
      glowColor: "rgba(34,197,94,0.3)",
      borderColor: "rgba(34,197,94,0.2)",
      textColor: "text-green-400",
      bgGradient: "from-green-500/10 to-transparent",
      change: `${transactions.filter((t) => t.type === "income").length} transactions`,
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpense),
      icon: <HiTrendingDown className="text-2xl" />,
      color: "red",
      glowColor: "rgba(239,68,68,0.3)",
      borderColor: "rgba(239,68,68,0.2)",
      textColor: "text-red-400",
      bgGradient: "from-red-500/10 to-transparent",
      change: `${transactions.filter((t) => t.type === "expense").length} transactions`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -6, scale: 1.01 }}
          className="relative rounded-2xl overflow-hidden cursor-default"
          style={{
            background: "rgba(30, 41, 59, 0.6)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${card.borderColor}`,
            boxShadow: card.isBalance
              ? `0 0 40px ${card.glowColor}, 0 8px 32px rgba(0,0,0,0.3)`
              : `0 8px 32px rgba(0,0,0,0.3)`,
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-60`}
          />

          {/* Decorative orb */}
          <div
            className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${card.glowColor}, transparent)`,
              filter: "blur(20px)",
            }}
          />

          <div className="relative p-5 lg:p-6">
            {/* Top row: label + icon */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm font-body font-medium tracking-wide uppercase text-xs">
                {card.label}
              </span>
              <div
                className={`${card.textColor} p-2.5 rounded-xl`}
                style={{
                  background: `${card.glowColor.replace("0.3", "0.1")}`,
                  border: `1px solid ${card.borderColor}`,
                }}
              >
                {card.icon}
              </div>
            </div>

            {/* Amount */}
            <div
              className={`font-amount font-bold text-2xl lg:text-3xl ${card.textColor} mb-2`}
              style={{
                filter:
                  card.isBalance
                    ? `drop-shadow(0 0 12px ${card.glowColor})`
                    : "none",
              }}
            >
              {card.value}
            </div>

            {/* Sub-label */}
            {card.change && (
              <div className="text-slate-500 text-xs font-body">
                {card.change}
              </div>
            )}

            {/* Balance bar */}
            {card.isBalance && totalIncome > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Spending rate</span>
                  <span>
                    {Math.round((totalExpense / totalIncome) * 100) || 0}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((totalExpense / totalIncome) * 100, 100)}%`,
                    }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #22C55E, #06B6D4, #EF4444)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;
