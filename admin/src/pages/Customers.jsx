import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, ShoppingBag, DollarSign, Loader2, Calendar } from 'lucide-react';
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

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pb-10 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Customers</h1>
        <p className="text-gray-400">View customer details, order history, and spending habits.</p>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.02]">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-500"
            />
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            Total Customers: {filteredCustomers.length}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-primary">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5">
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-8">Customer Detail</th>
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Joined Date</th>
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Total Orders</th>
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right pr-8">Total Spending</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-bold text-primary shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">{customer.name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                              <Mail size={10} />
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar size={14} className="text-gray-500" />
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                          <ShoppingBag size={14} className="text-gray-400" />
                          <span className="text-sm font-bold text-white">{customer.totalOrders}</span>
                        </div>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex items-center justify-end gap-1 text-primary">
                          <DollarSign size={16} />
                          <span className="text-sm font-black">{customer.totalSpending.toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-500 font-medium">
                      No customers found matching your search.
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
