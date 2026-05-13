import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Star, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../services/api';

const revenueData = [
  { name: 'Jan', revenue: 12000 },
  { name: 'Feb', revenue: 19000 },
  { name: 'Mar', revenue: 15000 },
  { name: 'Apr', revenue: 22000 },
  { name: 'May', revenue: 28000 },
  { name: 'Jun', revenue: 25000 },
  { name: 'Jul', revenue: 32000 },
];

const topProducts = [
  { id: 1, name: 'Organic Avocados', sales: 452, revenue: 2260, stock: 'In Stock', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=100&auto=format&fit=crop' },
  { id: 2, name: 'Fresh Strawberries', sales: 389, revenue: 1945, stock: 'Low Stock', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=100&auto=format&fit=crop' },
  { id: 3, name: 'Almond Milk', sales: 312, revenue: 1560, stock: 'In Stock', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=100&auto=format&fit=crop' },
  { id: 4, name: 'Whole Wheat Bread', sales: 284, revenue: 1136, stock: 'Out of Stock', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop' },
];

const StatCard = ({ title, value, icon, trend, isPositive, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 rounded-[2rem] flex flex-col relative overflow-hidden group"
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-3 rounded-2xl bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-primary/20 transition-all duration-300">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
        isPositive ? 'text-primary bg-primary/10' : 'text-red-500 bg-red-500/10'
      }`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 relative z-10">{title}</p>
    <h3 className="text-3xl font-black text-white relative z-10">{value}</h3>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Processing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Delivered': return 'text-primary bg-primary/10 border-primary/20';
      case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStockStyle = (stock) => {
    if (stock === 'In Stock') return 'text-primary';
    if (stock === 'Low Stock') return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor your store's performance and recent activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sales" value={`$${(stats.totalRevenue || 0).toFixed(2)}`} icon={<DollarSign size={24} />} trend="+12.5%" isPositive={true} delay={0.1} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={24} />} trend="+8.2%" isPositive={true} delay={0.2} />
        <StatCard title="Total Products" value={stats.totalProducts} icon={<Package size={24} />} trend="-2.4%" isPositive={false} delay={0.3} />
        <StatCard title="Total Customers" value={stats.totalUsers} icon={<Users size={24} />} trend="+15.3%" isPositive={true} delay={0.4} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Revenue Chart (Takes up 2 columns on extra large screens) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2 glass-card p-6 md:p-8 rounded-[2.5rem]"
        >
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Revenue Analytics</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Monthly Performance</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">7D</span>
              <span className="px-3 py-1 text-xs font-bold bg-primary/20 text-primary border border-primary/30 rounded-lg cursor-pointer">1M</span>
              <span className="px-3 py-1 text-xs font-bold bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">1Y</span>
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20,20,20,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Selling Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="xl:col-span-1 glass-card p-6 md:p-8 rounded-[2.5rem] flex flex-col"
        >
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Top Products</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">By Sales Volume</p>
            </div>
            <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <Star size={18} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer">
                <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover border border-white/10" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-gray-400">{product.sales} sales</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${getStockStyle(product.stock)}`}>{product.stock}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">${product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-all">
            View All Products
          </button>
        </motion.div>

      </div>
      
      {/* Recent Orders Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-[2.5rem] overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Recent Orders</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Latest Customer Transactions</p>
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors text-white">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-8">Order ID</th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <td className="p-5 pl-8 font-mono text-sm text-gray-300 group-hover:text-primary transition-colors">#{order._id.substring(order._id.length - 6)}</td>
                    <td className="p-5 text-sm font-bold text-white">{order.user?.name || 'Guest'}</td>
                    <td className="p-5 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-5 text-sm font-black text-gray-200">${order.totalPrice?.toFixed(2)}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 text-[10px] font-bold rounded-full border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-5 text-center text-gray-500">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;
