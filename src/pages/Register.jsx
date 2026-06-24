import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, User, Phone, Loader2, AlertCircle, Leaf, ShieldCheck, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import usePageTitle from '../hooks/usePageTitle';
import Logo from '../components/Logo';

const PasswordField = ({ name, placeholder, label, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
        <input
          type={show ? 'text' : 'password'}
          name={name}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const Register = () => {
  usePageTitle('Create Account');
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await register({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
    });
    if (result.success) {
      showToast('Account created! Welcome to FreshCart 🎉');
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const highlights = [
    { icon: <Leaf size={18} />, text: '100% certified organic products' },
    { icon: <ShieldCheck size={18} />, text: 'Secure payments & easy returns' },
    { icon: <Star size={18} />, text: 'Exclusive deals for members' },
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950 flex-col justify-between p-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/50 to-primary/20" />

        <div className="relative z-10">
          <Link to="/"><Logo size={44} showText textLight /></Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
            Your organic journey<br />
            <span className="text-gradient">starts here.</span>
          </h2>
          <p className="text-slate-300 text-lg font-medium leading-relaxed mb-10 max-w-sm">
            Create your free account and get access to the freshest organic groceries delivered to your door.
          </p>
          <div className="flex flex-col gap-4">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-slate-200"
              >
                <div className="p-2 rounded-xl bg-primary/20 text-primary">{h.icon}</div>
                <span className="text-sm font-semibold">{h.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">© 2026 FreshCart Premium</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-white relative overflow-hidden">
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

          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Create account</h1>
            <p className="text-slate-400 font-medium">Join FreshCart — it's free & takes 30 seconds</p>
          </div>

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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="tel" name="mobile" required
                  value={formData.mobile} onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Password fields side by side on md+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordField
                name="password" label="Password"
                placeholder="Min 6 chars"
                value={formData.password} onChange={handleChange}
              />
              <PasswordField
                name="confirmPassword" label="Confirm Password"
                placeholder="Repeat password"
                value={formData.confirmPassword} onChange={handleChange}
              />
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-400 font-medium">
              By creating an account you agree to our{' '}
              <a href="#" className="text-primary font-bold hover:underline">Terms of Service</a>
              {' & '}
              <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>.
            </p>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-4 rounded-2xl font-black text-white shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group mt-1 disabled:opacity-60"
            >
              {loading
                ? <Loader2 className="animate-spin" size={20} />
                : <><span>Create Account</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              }
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">Already a member?</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          {/* Login CTA */}
          <Link
            to="/login"
            className="w-full py-4 rounded-2xl font-black text-slate-700 border-2 border-slate-200 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2 group text-sm"
          >
            Sign in to existing account
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-primary" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
