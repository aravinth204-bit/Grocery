import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, User, ShoppingBasket } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4">
        <div className={`glass rounded-2xl md:rounded-full px-6 py-3 flex items-center justify-between border border-white/5 transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-primary/10' : ''}`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 overflow-hidden flex items-center justify-center">
              {settings?.storeInfo?.logo ? (
                <img src={settings.storeInfo.logo} alt="Logo" className="w-12 h-12 object-cover" />
              ) : (
                <div className="p-1"><ShoppingBasket size={24} /></div>
              )}
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
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

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium groceries..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-gray-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-primary transition-colors group">
              <ShoppingCart size={22} />
              <motion.span 
                key={cartCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-[#0a0a0a]"
              >
                {cartCount}
              </motion.span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/my-orders" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all group/user">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary group-hover/user:bg-primary group-hover/user:text-white transition-all">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-300 max-w-[80px] truncate">{user?.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group">
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/10 transition-colors">
                  <User size={18} />
                </div>
                <span>Login</span>
              </Link>
            )}
            
            <button className="btn-gradient px-6 py-2.5 rounded-full text-sm font-semibold text-white">
              Shop Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-300">
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
              className="p-2 text-gray-300 hover:text-white transition-colors"
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
            <div className="glass rounded-3xl p-6 flex flex-col gap-6 shadow-2xl border border-white/5">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search groceries..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm text-white focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <Link to="/" className="text-lg font-medium text-gray-300 hover:text-primary transition-colors">Home</Link>
                <Link to="/categories" className="text-lg font-medium text-gray-300 hover:text-primary transition-colors">Categories</Link>
                <Link to="/offers" className="text-lg font-medium text-gray-300 hover:text-primary transition-colors">Special Offers</Link>
              </div>
              <hr className="border-white/10" />
              <div className="flex items-center justify-between">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-gray-300">
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
