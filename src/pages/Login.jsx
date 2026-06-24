import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, Truck, Star } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import usePageTitle from '../hooks/usePageTitle';
import Logo from '../components/Logo';

const Login = () => {
  usePageTitle('Login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result.success) {
      showToast('Welcome back! Login successful.');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const perks = [
    { icon: <Truck size={18} />, text: 'Free delivery on orders over $50' },
    { icon: <ShieldCheck size={18} />, text: '100% organic & certified fresh' },
    { icon: <Star size={18} />, text: 'Exclusive member-only deals' },
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950 flex-col justify-between p-16">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/60 to-primary/20" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/"><Logo size={44} showText textLight /></Link>
        </div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
            Fresh groceries,<br />
            <span className="text-gradient">delivered fast.</span>
          </h2>
          <p className="text-slate-300 text-lg font-medium leading-relaxed mb-10 max-w-sm">
            Join thousands of happy customers enjoying premium organic produce every day.
          </p>
          <div className="flex flex-col gap-4">
            {perks.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-slate-200"
              >
                <div className="p-2 rounded-xl bg-primary/20 text-primary">{p.icon}</div>
                <span className="text-sm font-semibold">{p.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
            © 2026 FreshCart Premium
          </p>
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-white relative overflow-hidden">
        {/* subtle bg blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-100/60 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link to="/"><Logo size={40} showText /></Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Welcome back</h1>
            <p className="text-slate-400 font-medium">Sign in to your FreshCart account</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-600 text-sm"
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-5 h-5 rounded-md border-2 border-slate-200 peer-checked:bg-primary peer-checked:border-primary transition-all" />
              </div>
              <span className="text-sm text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-4 rounded-2xl font-black text-white shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group mt-2 disabled:opacity-60"
            >
              {loading
                ? <Loader2 className="animate-spin" size={20} />
                : <><span>Sign In</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              }
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">New here?</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          {/* Register CTA */}
          <Link
            to="/register"
            className="w-full py-4 rounded-2xl font-black text-slate-700 border-2 border-slate-200 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2 group text-sm"
          >
            Create a new account
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-primary" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
