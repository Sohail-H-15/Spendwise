// =============================================
//  SpendWise - Main App Component
//  Root component that manages all state
// =============================================

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Analytics from "./components/Analytics";
import { getTransactions } from "./utils/api";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all transactions from the backend
  const fetchTransactions = useCallback(async () => {
    try {
      setError("");
      const { data } = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(
        "⚠️ Cannot connect to backend. Make sure the server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on first load
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div
      className="min-h-screen bg-grid"
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content - padded for navbar */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          {/* ── Hero: Big Balance Number ── */}
          <HeroSection transactions={transactions} />

          {/* ── Backend Error Banner ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-body flex items-center gap-2"
            >
              {error}
            </motion.div>
          )}

          {/* ── Loading State ── */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full mx-auto mb-4"
                />
                <p className="text-slate-500 text-sm font-body">Loading your data...</p>
              </div>
            </div>
          )}

          {!loading && (
            <div className="space-y-6 lg:space-y-8">

              {/* ── Summary Cards ── */}
              <SummaryCards transactions={transactions} />

              {/* ── Analytics Charts ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                  <span className="text-slate-500 text-xs font-body tracking-[0.2em] uppercase px-3">
                    Analytics
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                </div>
                <Analytics transactions={transactions} />
              </motion.div>

              {/* ── Form + List Grid ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                  <span className="text-slate-500 text-xs font-body tracking-[0.2em] uppercase px-3">
                    Transactions
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
                  {/* Form: narrower */}
                  <div className="lg:col-span-2">
                    <TransactionForm onTransactionAdded={fetchTransactions} />
                  </div>

                  {/* List: wider */}
                  <div className="lg:col-span-3">
                    <TransactionList
                      transactions={transactions}
                      onDeleted={fetchTransactions}
                    />
                  </div>
                </div>
              </motion.div>

              {/* ── Footer ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center pt-4 pb-2"
              >
                <p className="text-slate-700 text-xs font-body">
                  SpendWise — MERN Stack Micro Project &nbsp;·&nbsp; Built with
                  <span className="text-cyan-600"> React</span>,
                  <span className="text-green-700"> Node.js</span>,
                  <span className="text-cyan-700"> MongoDB</span>
                </p>
              </motion.div>

            </div>
          )}
        </div>
      </main>

      {/* Background glow effects (decorative, fixed) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06B6D4, transparent)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #22C55E, transparent)", filter: "blur(60px)" }}
        />
      </div>
    </div>
  );
}

export default App;
