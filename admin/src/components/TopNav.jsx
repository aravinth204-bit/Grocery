import React from 'react';
import { Menu, Search, Mail, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { useTheme } from '../context/ThemeContext';

const TopNav = ({ setSidebarOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="h-24 bg-white/60 dark:bg-[#0f172a]/60 backdrop-blur-2xl border-b border-slate-100/50 dark:border-white/5 flex items-center justify-between px-6 md:px-10 z-[50] transition-all duration-300">

      <div className="flex items-center gap-6 flex-1">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-3 text-slate-500 dark:text-slate-400 rounded-2xl bg-slate-100 dark:bg-slate-800 transition-all border border-slate-200 dark:border-white/5"
        >
          <Menu size={22} />
        </motion.button>

        <div className="hidden md:flex relative w-full max-w-lg group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-all duration-300" size={20} />
          <input
            type="text"
            placeholder="Search dashboard elite..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl py-3.5 pl-14 pr-6 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-500 dark:text-amber-400 transition-all shadow-sm"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        {/* Messages */}
        <Link to="/support">
          <motion.button 
            whileHover={{ y: -2, backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 text-slate-500 dark:text-slate-400 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 transition-all group shadow-sm"
          >
            <Mail size={22} />
          </motion.button>
        </Link>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Admin Profile Mini */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="hidden sm:flex items-center gap-4 pl-6 border-l border-slate-100 dark:border-white/5 cursor-pointer group"
        >
          <div className="text-right">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1.5">Premium Admin</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">Aravinth Thala</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 flex items-center justify-center text-primary font-black text-lg shadow-sm group-hover:shadow-lg group-hover:shadow-primary/10 transition-all">
            A
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default TopNav;
