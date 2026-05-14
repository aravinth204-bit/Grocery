import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, X, ShoppingBag, Eye, Calendar, MapPin, CreditCard, Loader2, Trash2, Filter, Download, Package } from 'lucide-react';
import { getOrders, updateOrderStatus, deleteOrder } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      setOrders(res.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state without fetching again for better UX
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await deleteOrder(id);
        setOrders(orders.filter(order => order._id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Delivered': return 'text-primary bg-primary/10 border-primary/20';
      case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'; // Pending
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (o.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 pb-10 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Orders Management</h1>
        <p className="text-gray-400">View customer orders, update statuses, and track deliveries.</p>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.02]">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-500"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-full sm:w-auto">
              <Filter size={16} className="text-gray-500 mr-2" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-300 outline-none appearance-none pr-6 cursor-pointer w-full"
              >
                <option value="All" className="bg-dark-bg text-white">All Statuses</option>
                <option value="Pending" className="bg-dark-bg text-white">Pending</option>
                <option value="Processing" className="bg-dark-bg text-white">Processing</option>
                <option value="Shipped" className="bg-dark-bg text-white">Shipped</option>
                <option value="Delivered" className="bg-dark-bg text-white">Delivered</option>
                <option value="Cancelled" className="bg-dark-bg text-white">Cancelled</option>
              </select>
              <ChevronDown size={14} className="text-gray-500 absolute right-3 pointer-events-none" />
            </div>
            
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10 whitespace-nowrap">
              Total: {filteredOrders.length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-primary">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5">
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-8">Order ID</th>
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment</th>
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5 pl-8 font-mono text-sm text-gray-300 group-hover:text-primary transition-colors">
                        #{order._id.substring(order._id.length - 8)}
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-bold text-white mb-1">{order.user?.name || 'Guest User'}</p>
                        <p className="text-[10px] text-gray-500">{order.shippingAddress?.city}</p>
                      </td>
                      <td className="p-5 text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-5 text-sm font-black text-white">
                        ${(order.totalPrice || 0).toFixed(2)}
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="p-5">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={statusUpdating === order._id}
                          className={`appearance-none px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer ${getStatusColor(order.status)} ${statusUpdating === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="Pending" className="bg-dark-bg text-gray-400">Pending</option>
                          <option value="Processing" className="bg-dark-bg text-amber-500">Processing</option>
                          <option value="Shipped" className="bg-dark-bg text-blue-500">Shipped</option>
                          <option value="Delivered" className="bg-dark-bg text-primary">Delivered</option>
                          <option value="Cancelled" className="bg-dark-bg text-red-500">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end gap-2 ml-auto">
                          <button 
                            onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all text-xs font-bold"
                            title="View Details"
                          >
                            <Eye size={14} />
                            Details
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-gray-400 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-500 font-medium">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Details Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass border border-white/10 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative"
            >
              <div className="sticky top-0 bg-[#141414]/90 backdrop-blur-md p-6 md:p-8 border-b border-white/5 flex justify-between items-start z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-black text-white">Order Details</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-gray-400 font-mono text-sm">#{selectedOrder._id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedOrder.invoiceUrl && (
                    <a 
                      href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://grocery-z8ij.onrender.com'}${selectedOrder.invoiceUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-primary/10 hover:bg-primary/20 rounded-xl text-primary flex items-center gap-2 transition-colors text-xs font-bold"
                    >
                      <Download size={18} />
                      Invoice
                    </a>
                  )}
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div className="glass-card p-6 rounded-[2rem]">
                  <div className="flex items-center gap-3 text-primary mb-4">
                    <ShoppingBag size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-xs">Customer Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Name</p>
                      <p className="text-white font-medium">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Mobile Number</p>
                      <p className="text-white font-medium">{selectedOrder.shippingAddress?.mobileNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="glass-card p-6 rounded-[2rem]">
                  <div className="flex items-center gap-3 text-secondary mb-4">
                    <MapPin size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-xs">Shipping & Payment</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Address</p>
                      <p className="text-white text-sm">
                        {selectedOrder.shippingAddress?.address},<br/>
                        {selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.pincode}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-gray-500" />
                      <p className="text-white text-sm font-bold uppercase tracking-widest">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Ordered Products */}
                <div className="md:col-span-2 glass-card p-6 md:p-8 rounded-[2.5rem]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-white">
                      <Package size={20} />
                      <h3 className="font-bold uppercase tracking-widest text-xs">Ordered Products</h3>
                    </div>
                    <span className="text-xs text-gray-500 font-bold">{selectedOrder.orderItems?.length} items</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {selectedOrder.orderItems?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 rounded-xl object-cover bg-white/5"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-500 mb-1">${(item.price || 0).toFixed(2)} each</p>
                          <p className="text-sm font-black text-primary">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Grand Total</p>
                      <p className="text-3xl font-black text-white">${(selectedOrder.totalPrice || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
