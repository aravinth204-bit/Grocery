import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Star, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ title, value, icon, trend, isPositive, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ delay, type: "spring", stiffness: 300 }}
    className="glass-card p-7 rounded-[2.5rem] flex flex-col relative overflow-hidden group shadow-sm"
  >
    <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300 shadow-inner">
        {icon}
      </div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${isPositive ? 'text-primary bg-primary/10' : 'text-red-500 bg-red-500/10'
        }`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </motion.div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">{title}</p>
    <h3 className="text-4xl font-black text-slate-900 dark:text-white relative z-10 tracking-tight">{value}</h3>
  </motion.div>
);

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    monthlyData: [],
    topProducts: []
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
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Monitor your store's performance and recent activities.</p>
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

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2 glass-card p-8 md:p-10 rounded-[3rem]"
        >
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Revenue Analytics</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Monthly Store Growth</p>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
              <span className="px-4 py-2 text-[10px] font-black bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 cursor-pointer hover:text-primary transition-all uppercase tracking-widest">7D</span>
              <span className="px-4 py-2 text-[10px] font-black bg-primary text-white rounded-xl shadow-lg shadow-primary/20 border border-primary cursor-pointer uppercase tracking-widest">1M</span>
              <span className="px-4 py-2 text-[10px] font-black bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 cursor-pointer hover:text-primary transition-all uppercase tracking-widest">1Y</span>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyData || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"} vertical={false} />
                <XAxis dataKey="name" stroke={isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} fontSize={11} fontWeight={700} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} fontSize={11} fontWeight={700} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                <Tooltip
                  cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1e293b' : 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(10px)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '1.5rem', 
                    color: isDarkMode ? '#f8fafc' : '#0f172a', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
                  }}
                  itemStyle={{ color: '#10b981', fontWeight: '900', fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" />
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Top Products</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">By Sales Volume</p>
            </div>
            <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600">
              <Star size={18} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            {stats.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-100 dark:hover:border-white/5 transition-all cursor-pointer group/item">
                  <img src={getImageUrl(product.image)} alt={product.name} className="w-14 h-14 rounded-xl object-cover border border-slate-100 dark:border-white/10 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover/item:text-primary transition-colors">{product.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-slate-400 font-bold">{product.sales} sales</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${getStockStyle(product.stock)}`}>{product.stock}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">${product.revenue}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                 <Package size={40} className="mb-2 text-slate-300 dark:text-slate-600" />
                 <p className="text-xs font-bold text-slate-400">No Sales Yet</p>
              </div>
            )}
          </div>

          <button className="w-full mt-6 py-3 border border-slate-100 dark:border-white/5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-all">
            View All Products
          </button>
        </motion.div>

      </div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5"
      >
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Recent Orders</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Latest Customer Transactions</p>
          </div>
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-white/5">
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-8">Order ID</th>
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="p-5 pl-8 font-mono text-sm text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">#{order._id.substring(order._id.length - 6)}</td>
                    <td className="p-5 text-sm font-bold text-slate-900 dark:text-slate-200">{order.user?.name || 'Guest'}</td>
                    <td className="p-5 text-sm text-slate-400 dark:text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-5 text-sm font-black text-slate-700 dark:text-slate-300">${order.totalPrice?.toFixed(2)}</td>
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
