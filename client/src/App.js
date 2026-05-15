// =============================================
//  SpendWise - Main App Component
//  Root component that manages all state
// =============================================

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { HiDownload } from "react-icons/hi";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Analytics from "./components/Analytics";
import Login from "./components/Login";
import Register from "./components/Register";
import { getTransactions, getInsights } from "./utils/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all transactions from the backend
  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setError("");
      const { data } = await getTransactions();
      setTransactions(data);
      
      const res = await getInsights();
      setInsights(res.data);
    } catch (err) {
      setError(
        "⚠️ Cannot connect to backend. Make sure the server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch on first load
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [fetchTransactions, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFullPDF = async () => {
    if (!dashboardRef.current) return;
    setIsDownloading(true);
    try {
      // Temporarily hide elements that shouldn't be in the PDF if needed (like the download button)
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, backgroundColor: "#0F172A", useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save("spendwise-full-report.pdf");
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const Dashboard = () => (
    <div
      className="min-h-screen bg-grid"
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* Fixed Navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Main Content - padded for navbar */}
      <main className="pt-16" ref={dashboardRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex justify-end mt-4 mb-2">
            <button
              onClick={downloadFullPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-body border border-slate-700 transition shadow-lg"
            >
              <HiDownload className="text-lg" />
              {isDownloading ? "Generating PDF..." : "Download Full Report"}
            </button>
          </div>

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

              {/* ── Smart Insights ── */}
              {insights && insights.suggestion && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-bright p-6 rounded-2xl border border-white/5" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)", borderLeft: "4px solid #06B6D4" }}>
                  <h3 className="text-white font-display font-semibold mb-2 flex items-center gap-2">
                    <span className="text-cyan-400">💡</span> AI Assistant Insights
                  </h3>
                  <p className="text-slate-300 text-sm">{insights.suggestion}</p>
                </motion.div>
              )}

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
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
