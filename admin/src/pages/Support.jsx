import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Search, Trash2, CheckCircle2, Clock, AlertCircle, 
  MessageSquare, User, Calendar, Filter, ChevronRight, X, Loader2,
  Inbox, Reply, Star
} from 'lucide-react';
import { getMessages, updateMessageStatus, deleteMessage } from '../services/api';

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await getMessages();
      setMessages(res.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await updateMessageStatus(id, status);
      setMessages(messages.map(m => m._id === id ? { ...m, status } : m));
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id);
        setMessages(messages.filter(m => m._id !== id));
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'unread': return { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <Inbox size={14} /> };
      case 'read': return { color: 'text-slate-400 bg-slate-100 border-slate-200', icon: <CheckCircle2 size={14} /> };
      case 'replied': return { color: 'text-primary bg-primary/10 border-primary/20', icon: <Reply size={14} /> };
      default: return { color: 'text-slate-400 bg-slate-100 border-slate-200', icon: <Inbox size={14} /> };
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    replied: messages.filter(m => m.status === 'replied').length
  };

  return (
    <div className="flex flex-col gap-8 pb-10 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Support Inbox</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage customer inquiries and provide elite support.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-[2.5rem] bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center gap-5">
           <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
             <Inbox size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unread Messages</p>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stats.unread}</h3>
           </div>
        </div>
        <div className="glass-card p-6 rounded-[2.5rem] bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center gap-5">
           <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
             <Reply size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Replied</p>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stats.replied}</h3>
           </div>
        </div>
        <div className="glass-card p-6 rounded-[2.5rem] bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center gap-5">
           <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center">
             <Star size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">All Support Hits</p>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</h3>
           </div>
        </div>
      </div>

      {/* Inbox Area */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px] border border-slate-100 dark:border-white/5 bg-white/80 dark:bg-[#1e293b]/50">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-2.5 w-full sm:w-auto focus-within:border-primary transition-all shadow-sm">
                <Filter size={16} className="text-slate-400 mr-2" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none appearance-none pr-8 cursor-pointer w-full"
                >
                  <option value="All">All Inquiries</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
             </div>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-primary gap-4">
              <Loader2 className="animate-spin" size={40} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Fetching Inbox...</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <div 
                    key={msg._id}
                    onClick={() => { setSelectedMessage(msg); setIsModalOpen(true); if(msg.status === 'unread') handleStatusChange(msg._id, 'read'); }}
                    className={`p-6 border-b border-slate-100 dark:border-white/5 flex items-center gap-6 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-white/5 group ${msg.status === 'unread' ? 'bg-blue-50/20 dark:bg-blue-500/5' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-white/10 flex items-center justify-center text-primary font-black text-lg group-hover:scale-110 transition-transform duration-500">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{msg.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusInfo(msg.status).color}`}>
                            {msg.status}
                          </span>
                       </div>
                       <p className={`text-sm font-bold text-slate-600 dark:text-slate-300 truncate ${msg.status === 'unread' ? 'text-slate-900 dark:text-white font-black' : ''}`}>
                          {msg.subject}
                       </p>
                       <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-1">
                          {msg.message.substring(0, 80)}...
                       </p>
                    </div>
                    <div className="text-right hidden sm:block">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Received At</p>
                       <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-all" />
                  </div>
                ))
              ) : (
                <div className="p-20 text-center">
                   <div className="flex flex-col items-center gap-3 opacity-30">
                    <MessageSquare size={64} className="text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">No Inquiries Found</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Message View Modal */}
      <AnimatePresence>
        {isModalOpen && selectedMessage && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-[3rem] shadow-2xl border border-slate-100 dark:border-white/5 flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${getStatusInfo(selectedMessage.status).color}`}>
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Customer Inquiry</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedMessage.status}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8">
                 {/* From Card */}
                 <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-primary font-black text-xl">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                       <p className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1">{selectedMessage.name}</p>
                       <p className="text-xs font-bold text-slate-400">{selectedMessage.email}</p>
                    </div>
                 </div>

                 {/* Message Body */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                       <Star size={16} />
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Inquiry Details</h3>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5">
                       <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4 leading-tight">"{selectedMessage.subject}"</h4>
                       <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                       </p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 px-4">
                       <Calendar size={14} />
                       <span className="text-xs font-bold">Received on {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                    <button 
                      onClick={() => handleStatusChange(selectedMessage._id, 'replied')}
                      disabled={selectedMessage.status === 'replied'}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        selectedMessage.status === 'replied' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' 
                        : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]'
                      }`}
                    >
                      <Reply size={18} />
                      {selectedMessage.status === 'replied' ? 'Already Replied' : 'Mark as Replied'}
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Support;
