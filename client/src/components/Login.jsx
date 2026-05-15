import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuth(true);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid" style={{ backgroundColor: "#0F172A" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-bright p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl text-white font-display font-bold mb-6 text-center">Welcome Back</h2>
        {error && <p className="text-red-400 bg-red-500/10 p-3 rounded mb-4 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl input-field text-white" required />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl input-field text-white" required />
          </div>
          <button type="submit" className="w-full py-3 mt-4 rounded-xl text-white font-semibold" style={{ background: "linear-gradient(135deg, #06B6D4, #0891B2)" }}>Login</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Don't have an account? <Link to="/register" className="text-cyan-400">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
