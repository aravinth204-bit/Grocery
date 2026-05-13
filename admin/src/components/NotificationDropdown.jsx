import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShoppingBag, Check, CheckCheck, Loader2, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all group ${
          isOpen ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-dark-bg ${
              isOpen ? 'bg-white text-primary' : 'bg-red-500 text-white'
            }`}
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

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
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-[350px] md:w-[400px] glass-card rounded-[2rem] border border-white/10 shadow-2xl z-[70] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-bold text-white flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                </h3>
                <button 
                  onClick={markAllRead}
                  className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              </div>

              {/* List */}
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`p-5 border-b border-white/5 flex gap-4 cursor-pointer transition-all hover:bg-white/[0.03] relative group ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                    >
                      <div className={`p-3 rounded-2xl shrink-0 h-fit ${!n.isRead ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500'}`}>
                        <ShoppingBag size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-bold truncate ${!n.isRead ? 'text-white' : 'text-gray-400'}`}>{n.title}</h4>
                          <span className="text-[10px] text-gray-600 font-medium">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                      {!n.isRead && (
                        <div className="absolute right-4 bottom-4 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-10 flex flex-col items-center justify-center text-gray-600 gap-2">
                    <div className="p-4 rounded-full bg-white/5 mb-2">
                      <Bell size={32} opacity={0.2} />
                    </div>
                    <p className="text-sm font-medium">No notifications yet</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest">We'll notify you about new orders</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <button className="w-full p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-t border-white/5">
                View All Activity
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
