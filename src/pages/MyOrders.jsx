import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Calendar, ChevronRight, Clock, CheckCircle2, Truck, ShoppingBag, ArrowLeft, Loader2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';

const MyOrders = () => {
  usePageTitle('My Orders');
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'delivered': return 'text-primary bg-primary/10 border-primary/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return <Clock size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'delivered': return <CheckCircle2 size={14} />;
      default: return <Package size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <Loader2 size={48} className="text-primary animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Fetching your order history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-dark-bg">
      <div className="container mx-auto max-w-4xl">
        
        <header className="mb-12">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group w-fit">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to shopping
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-800 mb-2">My <span className="text-gradient">Orders</span></h1>
              <p className="text-slate-500">Track and manage your premium grocery deliveries</p>
            </div>
            <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Orders</p>
                <p className="text-xl font-black text-primary">{orders.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <Package size={24} className="text-slate-450" />
            </div>
          </div>
        </header>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-16 rounded-[3rem] text-center"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">No orders yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              You haven't placed any orders yet. Start shopping to experience our premium organic products!
            </p>
            <Link to="/" className="btn-gradient px-10 py-4 rounded-2xl font-bold text-white inline-block shadow-xl shadow-primary/20">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-[2.5rem] border border-slate-100 hover:border-slate-200 transition-all overflow-hidden group"
              >
                {/* Order Header */}
                <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-slate-100 text-slate-400 group-hover:text-primary transition-colors">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="text-sm font-mono text-slate-700">#{order._id}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-lg font-black text-primary">${order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  {/* Products List */}
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Items</p>
                    <div className="flex flex-wrap gap-3">
                      {order.orderItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-2 pr-4 border border-slate-200/60">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="text-xs font-bold text-slate-700">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.quantity} Unit{item.quantity > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Preview */}
                  <div className="md:w-64 border-l border-slate-100 md:pl-8 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Shipping To</p>
                    <p className="text-sm text-slate-600 mb-1">{order.shippingAddress.address}</p>
                    <p className="text-xs text-slate-400">{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                  </div>

                  {/* Details Button */}
                  <div className="flex items-center">
                    <Link 
                      to={`/order-success/${order._id}`} 
                      className="p-3 rounded-2xl bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all group/btn"
                    >
                      <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
