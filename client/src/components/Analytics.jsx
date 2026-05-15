// =============================================
//  SpendWise - Analytics Charts Component
//  Pie chart + Bar chart for expense analysis
// =============================================

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
} from "recharts";
import { MdBarChart, MdPieChart, MdDownload } from "react-icons/md";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Color palette for pie chart slices
const CHART_COLORS = [
  "#06B6D4", "#22C55E", "#F59E0B", "#8B5CF6",
  "#EC4899", "#F97316", "#14B8A6", "#EF4444",
];

const formatCurrency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

// Custom tooltip for pie chart
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-bright px-4 py-3 rounded-xl border border-cyan-500/20 text-sm">
      <p className="text-slate-300 font-body font-medium">{payload[0].name}</p>
      <p className="text-cyan-400 font-amount font-semibold mt-0.5">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

// Custom tooltip for bar chart
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-bright px-4 py-3 rounded-xl border border-white/10 text-sm">
      <p className="text-slate-400 font-body text-xs mb-1">{label}</p>
      {payload.map((p) => (
        <p
          key={p.name}
          className="font-amount font-semibold"
          style={{ color: p.color }}
        >
          {p.name === "income" ? "↑" : "↓"} {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

const Analytics = ({ transactions }) => {
  // ---- Pie Chart: Expense Breakdown by Category ----
  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  // ---- Bar Chart: Monthly Income vs Expense ----
  const monthlyData = transactions.reduce((acc, t) => {
    const d = new Date(t.date);
    const key = `${d.toLocaleString("en", { month: "short" })} '${String(d.getFullYear()).slice(2)}`;
    if (!acc[key]) acc[key] = { month: key, income: 0, expense: 0 };
    acc[key][t.type] += t.amount;
    return acc;
  }, {});

  // Sort months chronologically (last 6 months shown)
  const barData = Object.values(monthlyData).slice(-6);

  const chartsRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    if (!chartsRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(chartsRef.current, { scale: 2, backgroundColor: "#0F172A" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save("spendwise-analytics.pdf");
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-body border border-slate-700 transition"
        >
          <MdDownload className="text-lg" />
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 p-4 -m-4 rounded-xl" style={{ backgroundColor: "#0F172A" }}>

      {/* Expense Breakdown Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-bright rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <MdPieChart className="text-cyan-400 text-xl" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-base" style={{ letterSpacing: "-0.02em" }}>
              Expense Breakdown
            </h3>
            <p className="text-slate-500 text-xs">By category</p>
          </div>
        </div>

        <div className="p-4">
          {pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-600">
              <div className="text-4xl mb-3">🥧</div>
              <p className="font-body text-sm">No expense data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      stroke="rgba(15,23,42,0.5)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-slate-400 text-xs font-body">{value}</span>
                  )}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Monthly Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-bright rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <MdBarChart className="text-cyan-400 text-xl" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-base" style={{ letterSpacing: "-0.02em" }}>
              Monthly Overview
            </h3>
            <p className="text-slate-500 text-xs">Income vs Expenses</p>
          </div>
        </div>

        <div className="p-4">
          {barData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-600">
              <div className="text-4xl mb-3">📊</div>
              <p className="font-body text-sm">No data to display</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barGap={4} barSize={16}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(100,116,139,0.12)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748B", fontSize: 11, fontFamily: "DM Sans" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                  }
                  tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <ReferenceLine y={0} stroke="rgba(100,116,139,0.3)" />
                <Bar
                  dataKey="income"
                  fill="#22C55E"
                  radius={[6, 6, 0, 0]}
                  name="income"
                  style={{ filter: "drop-shadow(0 0 6px rgba(34,197,94,0.3))" }}
                />
                <Bar
                  dataKey="expense"
                  fill="#EF4444"
                  radius={[6, 6, 0, 0]}
                  name="expense"
                  style={{ filter: "drop-shadow(0 0 6px rgba(239,68,68,0.3))" }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-400" />
              <span className="text-slate-500 text-xs font-body">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-400" />
              <span className="text-slate-500 text-xs font-body">Expenses</span>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
