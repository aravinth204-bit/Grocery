import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, User, ShoppingBasket } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Magnetic from './Magnetic';

const Navbar = () => {
  const { cartCount } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  
  const isHome = location.pathname === '/';
  const isDarkBg = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to products when searching
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const section = document.getElementById('products-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searchQuery]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      {/* Elite Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-emerald-400 z-[60]"
        style={{ width: `${scrollProgress}%` }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />

      <div className="container mx-auto px-6">
        <div className={`rounded-3xl md:rounded-[2.5rem] px-8 py-4 flex items-center justify-between border transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-white/40' 
            : isDarkBg 
              ? 'bg-white/10 backdrop-blur-md border-white/10 shadow-none' 
              : 'bg-white/40 backdrop-blur-xl border-white/40 shadow-none'
        }`}>
          
          {/* Logo */}
          <Magnetic>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-1 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 overflow-hidden flex items-center justify-center shadow-sm">
                {settings?.storeInfo?.logo ? (
                  <img src={settings.storeInfo.logo} alt="Logo" className="w-12 h-12 object-cover" />
                ) : (
                  <div className="p-2"><ShoppingBasket size={28} /></div>
                )}
              </div>
              <span className={`text-2xl font-black tracking-tighter hidden lg:block transition-colors ${isDarkBg ? 'text-white' : 'text-slate-900'}`}>
                {settings?.storeInfo?.name ? (
                  <>
                    {settings.storeInfo.name.split(' ')[0]}
                    <span className="text-primary"> {settings.storeInfo.name.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  <>Fresh<span className="text-primary">Cart</span></>
                )}
              </span>
            </Link>
          </Magnetic>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDarkBg ? 'text-white/50 group-focus-within:text-primary' : 'text-slate-400 group-focus-within:text-primary'}`} size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium groceries..."
                className={`w-full rounded-full py-2.5 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all ${
                  isDarkBg 
                    ? 'bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:bg-white focus:text-slate-900 focus:border-transparent' 
                    : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-8">
            <Magnetic>
              <Link to="/cart" className={`relative p-3 transition-all group ${isDarkBg ? 'text-white/80 hover:text-primary' : 'text-slate-400 hover:text-primary'}`}>
                <ShoppingCart size={24} />
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 bg-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              </Link>
            </Magnetic>

            <Magnetic>
              <Link to="/contact" className={`text-[11px] font-black transition-all uppercase tracking-widest px-2 ${isDarkBg ? 'text-white/80 hover:text-primary' : 'text-slate-400 hover:text-primary'}`}>
                Contact
              </Link>
            </Magnetic>

            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <Magnetic>
                  <Link to="/my-orders" className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all group/user shadow-sm ${
                    isDarkBg 
                      ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' 
                      : 'bg-slate-50 hover:bg-white border-slate-100 text-slate-700'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary group-hover/user:bg-primary group-hover/user:text-white transition-all">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-sm font-black max-w-[100px] truncate ${isDarkBg ? 'text-white' : 'text-slate-700'}`}>{user?.name}</span>
                  </Link>
                </Magnetic>
                <button 
                  onClick={logout}
                  className="text-[10px] font-black text-slate-300 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Magnetic>
                <Link to="/login" className={`flex items-center gap-3 text-sm font-black transition-all group ${isDarkBg ? 'text-white/80 hover:text-primary' : 'text-slate-400 hover:text-primary'}`}>
                  <div className={`p-3 rounded-2xl transition-all ${isDarkBg ? 'bg-white/10 group-hover:bg-primary/20' : 'bg-slate-50 group-hover:bg-primary/10'}`}>
                    <User size={20} />
                  </div>
                  <span className="uppercase tracking-widest text-[11px]">Login</span>
                </Link>
              </Magnetic>
            )}
            
            <Magnetic>
              <button 
                onClick={() => document.getElementById('offer-banner')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-gradient px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                Elite Offers
              </button>
            </Magnetic>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className={`relative p-2 transition-colors ${isDarkBg ? 'text-white' : 'text-slate-600'}`}>
              <ShoppingCart size={22} />
              <motion.span 
                key={cartCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 bg-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-white"
              >
                {cartCount}
              </motion.span>
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors ${isDarkBg ? 'text-white hover:text-white/80' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 px-4 md:hidden"
          >
            <div className="glass rounded-3xl p-6 flex flex-col gap-6 shadow-2xl border border-slate-100 bg-white/95">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search groceries..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-sm text-slate-900 focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 hover:text-primary transition-colors">Home</Link>
                {isAuthenticated && (
                  <Link to="/my-orders" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 hover:text-primary transition-colors">My Orders</Link>
                )}
                <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 hover:text-primary transition-colors">Contact Support</Link>
              </div>
              <hr className="border-slate-100" />
              <div className="flex items-center justify-between">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-slate-700">
                  <User size={20} />
                  Login
                </Link>
                <button className="btn-gradient px-8 py-3 rounded-2xl font-bold text-white">
                  Shop Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
