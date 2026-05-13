import React from 'react';
import { Menu, Search, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationDropdown from './NotificationDropdown';

const TopNav = ({ setSidebarOpen }) => {
  return (
    <header className="h-20 bg-dark-bg/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-6 lg:px-8 z-[50]">
      
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search products, orders, or users..."
            className="w-full bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Messages */}
        <button className="relative p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all group">
          <Mail size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full border-2 border-dark-bg"></span>
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Admin Profile Mini */}
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/5">
          <div className="text-right">
            <p className="text-xs font-bold text-white leading-none">Super Admin</p>
            <p className="text-[10px] font-medium text-gray-500 mt-1">Status: Online</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
