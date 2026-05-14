import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  ShoppingBag, 
  User, 
  AlertTriangle, 
  Clock, 
  MoreHorizontal, 
  Trash2, 
  Check,
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER': return <ShoppingBag className="text-blue-500" size={20} />;
      case 'USER': return <User className="text-emerald-500" size={20} />;
      case 'SYSTEM': return <AlertTriangle className="text-amber-500" size={20} />;
      default: return <Bell className="text-primary" size={20} />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesTab = activeTab === 'all' ? true : (activeTab === 'unread' ? !n.isRead : n.type === activeTab.toUpperCase());
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate based on type/metadata
    if (notification.type === 'ORDER') {
      navigate('/orders');
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'order', label: 'Orders' },
    { id: 'system', label: 'System' }
  ];

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-500">Stay updated with real-time orders and system activities.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 font-bold px-6 py-3 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <Check size={18} />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar w-full md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[1.5rem] pl-12 pr-6 py-3.5 text-sm focus:outline-none focus:border-primary/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n, index) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNotificationClick(n)}
                className={`group relative glass-card p-5 md:p-6 rounded-[2rem] border transition-all cursor-pointer flex gap-4 md:gap-6 items-start ${
                  n.isRead ? 'bg-white border-slate-100 opacity-80' : 'bg-white border-primary/20 shadow-xl shadow-primary/5 ring-1 ring-primary/5'
                }`}
              >
                {!n.isRead && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                )}

                <div className={`p-4 rounded-2xl shrink-0 ${
                  n.type === 'ORDER' ? 'bg-blue-50' : 
                  n.type === 'USER' ? 'bg-emerald-50' : 
                  n.type === 'SYSTEM' ? 'bg-amber-50' : 'bg-slate-50'
                }`}>
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`text-lg font-bold truncate ${n.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      <Clock size={12} />
                      {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed mb-4 ${n.isRead ? 'text-slate-400' : 'text-slate-500'}`}>
                    {n.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                       {!n.isRead && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                           className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                         >
                           Mark as read
                         </button>
                       )}
                    </div>
                    <div className="flex items-center gap-1 text-primary text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <Bell size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No notifications found</h3>
              <p className="text-slate-500">You're all caught up! New alerts will appear here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
