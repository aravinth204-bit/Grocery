import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { TrendingUp, ShoppingBag, PieChart as PieChartIcon, BarChart3, Download, Calendar } from 'lucide-react';

const monthlySalesData = [
  { name: 'Jan', sales: 4000, expected: 2400 },
  { name: 'Feb', sales: 3000, expected: 1398 },
  { name: 'Mar', sales: 2000, expected: 9800 },
  { name: 'Apr', sales: 2780, expected: 3908 },
  { name: 'May', sales: 1890, expected: 4800 },
  { name: 'Jun', sales: 2390, expected: 3800 },
  { name: 'Jul', sales: 3490, expected: 4300 },
  { name: 'Aug', sales: 4000, expected: 2400 },
  { name: 'Sep', sales: 3000, expected: 1398 },
  { name: 'Oct', sales: 2000, expected: 9800 },
  { name: 'Nov', sales: 2780, expected: 3908 },
  { name: 'Dec', sales: 1890, expected: 4800 },
];

const revenueGrowthData = [
  { name: 'Week 1', revenue: 4000 },
  { name: 'Week 2', revenue: 3000 },
  { name: 'Week 3', revenue: 2000 },
  { name: 'Week 4', revenue: 2780 },
  { name: 'Week 5', revenue: 1890 },
  { name: 'Week 6', revenue: 2390 },
  { name: 'Week 7', revenue: 3490 },
];

const orderStatusData = [
  { name: 'Delivered', value: 400 },
  { name: 'Processing', value: 300 },
  { name: 'Shipped', value: 300 },
  { name: 'Cancelled', value: 100 },
];
const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

const categoryData = [
  { name: 'Fruits', sales: 4000 },
  { name: 'Vegetables', sales: 3000 },
  { name: 'Dairy', sales: 2000 },
  { name: 'Bakery', sales: 2780 },
  { name: 'Meat', sales: 1890 },
  { name: 'Pantry', sales: 2390 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-xl">
        <p className="text-slate-900 font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color || entry.fill }} className="text-sm font-medium">
            {entry.name}: {entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('sales') ? '$' : ''}{entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  return (
    <div className="flex flex-col gap-8 pb-10 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Analytics</h1>
          <p className="text-slate-500">Deep dive into your store's metrics and growth.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all border border-slate-200 text-sm">
            <Calendar size={16} className="text-slate-400" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-emerald-400 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)] text-sm">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Sales (Bar Chart) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 md:p-8 rounded-[2.5rem] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <BarChart3 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Monthly Sales</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Actual vs Expected</p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(0,0,0,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="sales" name="Actual Sales" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expected" name="Expected Target" fill="rgba(0,0,0,0.05)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Growth (Line Chart) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-8 rounded-[2.5rem] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Revenue Growth</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Weekly Progression</p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(0,0,0,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0ea5e9" strokeWidth={4} dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders Overview (Pie Chart) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 md:p-8 rounded-[2.5rem] flex flex-col items-center relative"
        >
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                <PieChartIcon size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Orders Overview</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">By Status</p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-3xl font-black text-slate-900">1,100</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Orders</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {orderStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs font-bold text-slate-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Categories (Area Chart) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 md:p-8 rounded-[2.5rem] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Top Categories</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sales by Segment</p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCategory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(0,0,0,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="step" dataKey="sales" name="Sales" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorCategory)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Analytics;
