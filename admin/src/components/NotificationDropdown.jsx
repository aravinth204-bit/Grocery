import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShoppingBag, Check, CheckCheck, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  return (
    <div className="relative">
      {/* ... trigger button code ... */}
      <motion.button 
        whileHover={{ y: -2, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-2xl transition-all duration-300 group shadow-sm border ${
          isOpen ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-primary bg-slate-50 border-slate-100 hover:border-primary/20'
        }`}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 shadow-sm ${
              isOpen ? 'bg-white text-primary border-primary' : 'bg-red-500 text-white border-white'
            }`}
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to close */}
            <div 
              className="fixed inset-0 z-[60]" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute right-0 mt-5 w-[380px] md:w-[420px] glass-card rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-[70] overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">
                    Notifications
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Latest Updates</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={markAllRead}
                  className="px-4 py-2 bg-slate-100 hover:bg-primary/10 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-primary rounded-xl transition-all flex items-center gap-2 border border-slate-200"
                >
                  <CheckCheck size={14} />
                  Mark Read
                </motion.button>
              </div>

              {/* List */}
              <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-white/30">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <motion.div 
                      key={n._id}
                      whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                      onClick={() => { markAsRead(n._id); setIsOpen(false); }}
                      className={`p-6 border-b border-slate-50 flex gap-5 cursor-pointer transition-all relative group ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                    >
                      <div className={`p-4 rounded-[1.25rem] shrink-0 h-fit transition-all duration-500 ${!n.isRead ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-300'}`}>
                        <ShoppingBag size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className={`text-sm font-black tracking-tight truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-400'}`}>{n.title}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap ml-2">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className={`text-xs leading-relaxed line-clamp-2 ${!n.isRead ? 'text-slate-600' : 'text-slate-400'}`}>{n.message}</p>
                      </div>
                      {!n.isRead && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="p-16 flex flex-col items-center justify-center text-slate-300 gap-4 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 shadow-inner">
                      <Bell size={40} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 mb-1">All Caught Up!</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No new notifications to show</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50/50">
                <Link 
                  to="/notifications" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-primary transition-all flex items-center justify-center gap-3 border border-transparent hover:border-primary/10 rounded-2xl"
                >
                  <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                  View All Notifications
                  <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
