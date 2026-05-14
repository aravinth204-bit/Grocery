import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Mail, ShoppingBag, DollarSign, Loader2, Calendar, 
  Award, Star, TrendingUp, Users, UserCheck, ChevronRight
} from 'lucide-react';
import { getCustomers } from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (spending) => {
    if (spending >= 500) return { label: 'Platinum VIP', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', icon: <Award size={12} /> };
    if (spending >= 200) return { label: 'Gold Member', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <Star size={12} /> };
    return { label: 'New Member', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <UserCheck size={12} /> };
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: customers.length,
    vips: customers.filter(c => c.totalSpending >= 200).length,
    avgSpending: customers.length > 0 ? (customers.reduce((acc, curr) => acc + curr.totalSpending, 0) / customers.length).toFixed(2) : 0
  };

  return (
    <div className="flex flex-col gap-8 pb-10 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Customer VIP Hub</h1>
        <p className="text-slate-500">Track spending habits, manage tiers, and reward your best customers.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Customers</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.total}</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
            <Award size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">VIP Members</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.vips}</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Spending</p>
            <h3 className="text-2xl font-black text-slate-900">${stats.avgSpending}</h3>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px] border border-slate-100 bg-white/80">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all duration-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or tier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-5 py-3 rounded-2xl border border-slate-200">
                {filteredCustomers.length} Records
             </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-primary gap-4">
              <Loader2 className="animate-spin" size={40} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Customers...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Customer Detail</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Membership Tier</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Engagement</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-8">Total Investment</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => {
                    const tier = getTierInfo(customer.totalSpending);
                    return (
                      <tr key={customer._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-all group cursor-pointer">
                        <td className="p-5 pl-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-lg font-black text-primary group-hover:scale-110 transition-transform duration-500">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 mb-0.5 group-hover:text-primary transition-colors">{customer.name}</p>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                <Mail size={10} className="text-slate-300" />
                                {customer.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-tight ${tier.color}`}>
                            {tier.icon}
                            {tier.label}
                          </div>
                        </td>
                        <td className="p-5 text-sm text-slate-500 font-medium">
                          {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="p-5 text-center">
                          <div className="inline-flex items-center justify-center gap-3 px-4 py-2 bg-slate-100/50 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-slate-900 leading-none">{customer.totalOrders}</span>
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Orders</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 pr-8 text-right">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 text-primary">
                              <DollarSign size={16} />
                              <span className="text-lg font-black tracking-tight">{customer.totalSpending.toFixed(2)}</span>
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Lifetime Value</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                       <div className="flex flex-col items-center gap-3 opacity-30">
                        <Users size={64} className="text-slate-300" />
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">No Customers Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
