// =============================================
//  SpendWise - Navbar Component
// =============================================

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiWalletLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  // Add background blur when user scrolls down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            {/* Icon with glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-40" />
              <div className="relative bg-gradient-to-br from-cyan-400 to-cyan-600 p-2 rounded-xl">
                <RiWalletLine className="text-white text-xl" />
              </div>
            </div>

            {/* Brand Name */}
            <div>
              <span
                className="font-display font-800 text-xl tracking-tight text-white"
                style={{ fontWeight: 800, letterSpacing: "-0.03em" }}
              >
                Spend
                <span className="text-cyan-400 neon-text">Wise</span>
              </span>
              <div className="text-[10px] text-slate-500 font-body tracking-widest uppercase -mt-0.5">
                Budget Planner
              </div>
            </div>
          </motion.div>

          {/* Right side badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 badge-shimmer border border-cyan-500/20 px-3 py-1.5 rounded-full"
          >
            <HiSparkles className="text-cyan-400 text-sm" />
            <span className="text-xs font-body font-medium text-cyan-300 tracking-wide">
              MERN Stack
            </span>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
