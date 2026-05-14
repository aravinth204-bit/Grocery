import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Store,
  Bell
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logoutAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} />, color: 'text-emerald-500', bg: 'hover:bg-emerald-50' },
    { path: '/products', name: 'Products', icon: <Package size={20} />, color: 'text-blue-500', bg: 'hover:bg-blue-50' },
    { path: '/orders', name: 'Orders', icon: <ShoppingCart size={20} />, color: 'text-amber-500', bg: 'hover:bg-amber-50' },
    { path: '/notifications', name: 'Notifications', icon: <Bell size={20} />, color: 'text-purple-500', bg: 'hover:bg-purple-50' },
    { path: '/customers', name: 'Customers', icon: <Users size={20} />, color: 'text-pink-500', bg: 'hover:bg-pink-50' },
    { path: '/analytics', name: 'Analytics', icon: <BarChart2 size={20} />, color: 'text-indigo-500', bg: 'hover:bg-indigo-50' },
    { path: '/settings', name: 'Settings', icon: <Settings size={20} />, color: 'text-slate-600', bg: 'hover:bg-slate-100' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-slate-50/40 dark:bg-[#0f172a]/80 backdrop-blur-3xl border-r border-slate-200/60 dark:border-white/5 z-50 flex flex-col transition-all duration-500 shadow-[10px_0_40px_rgba(0,0,0,0.03)] ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className="p-10 pb-6">
          <div className="flex items-center gap-4 text-slate-900 dark:text-slate-100 group cursor-pointer">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20 transition-all"
            >
              <Store size={24} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">FreshCart</h1>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Admin Elite</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-6">Main Dashboard</p>
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  relative flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-[13px] transition-all duration-300 group
                  ${isActive
                    ? `bg-white dark:bg-slate-800 shadow-[0_10px_25px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-white/10 scale-[1.02] ${item.color}`
                    : `text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white ${item.bg} dark:hover:bg-white/5`}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className={`transition-all duration-300 ${isActive ? item.color : 'text-slate-300 dark:text-slate-600 group-hover:' + item.color}`}>
                      {React.cloneElement(item.icon, { size: 20 })}
                    </div>
                    <span className={`tracking-tight transition-colors duration-300 ${isActive ? 'font-black' : 'font-bold'}`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute left-0 w-1.5 h-6 rounded-r-full shadow-[2px_0_10px_rgba(0,0,0,0.1)] ${item.color.replace('text', 'bg')}`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User / Logout */}
        <div className="p-6 border-t border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-slate-900/50">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-500 transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            Sign Out Portal
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
