import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronDown, Check, X, ShoppingBag, Eye, Calendar, MapPin, 
  CreditCard, Loader2, Trash2, Filter, Download, Package, Truck, 
  CheckCircle2, Clock, AlertCircle, User
} from 'lucide-react';
import { getOrders, updateOrderStatus, deleteOrder } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

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
      const updatedOrders = orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
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

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Processing': return { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <Clock size={14} />, step: 1 };
      case 'Shipped': return { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <Truck size={14} />, step: 2 };
      case 'Delivered': return { color: 'text-primary bg-primary/10 border-primary/20', icon: <CheckCircle2 size={14} />, step: 3 };
      case 'Cancelled': return { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: <AlertCircle size={14} />, step: 0 };
      default: return { color: 'text-slate-400 bg-slate-100 border-slate-200', icon: <Clock size={14} />, step: 0 }; // Pending
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
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Orders Management</h1>
        <p className="text-slate-500">Track real-time transactions and manage delivery workflows.</p>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px] border border-slate-100 shadow-sm bg-white/80">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all duration-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 w-full sm:w-auto focus-within:border-primary transition-all shadow-sm">
              <Filter size={16} className="text-slate-400 mr-2" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 outline-none appearance-none pr-8 cursor-pointer w-full"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown size={14} className="text-slate-400 absolute right-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-primary gap-4">
              <Loader2 className="animate-spin" size={40} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Orders...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Order ID</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Info</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-all group">
                      <td className="p-5 pl-8">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm text-slate-500 group-hover:text-primary transition-colors">#{order._id.substring(order._id.length - 8)}</span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{order.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 mb-0.5">{order.user?.name || 'Guest User'}</p>
                            <p className="text-[10px] text-slate-400 font-medium tracking-tight">{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-sm text-slate-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-5 text-sm font-black text-slate-900">
                        ${(order.totalPrice || 0).toFixed(2)}
                      </td>
                      <td className="p-5">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black tracking-tight ${getStatusInfo(order.status).color}`}>
                          {getStatusInfo(order.status).icon}
                          {order.status}
                        </div>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end gap-2.5">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 rounded-2xl transition-all"
                            title="View Full Details"
                          >
                            <Eye size={18} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/5 rounded-2xl transition-all"
                            title="Delete Order"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-30">
                        <ShoppingBag size={64} className="text-slate-300" />
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">No Orders Found</p>
                      </div>
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
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 overflow-hidden">
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
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 md:p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/50">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg ${getStatusInfo(selectedOrder.status).color}`}>
                    <Package size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Details</h2>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusInfo(selectedOrder.status).color}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <p className="text-slate-400 font-mono text-sm">#{selectedOrder._id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {selectedOrder.invoiceUrl && (
                    <motion.a 
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedOrder.invoiceUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-sm hover:border-primary/30 transition-all text-xs font-black uppercase tracking-widest"
                    >
                      <Download size={18} className="text-primary" />
                      Invoice PDF
                    </motion.a>
                  )}
                  <motion.button 
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(false)}
                    className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Tracking & Info */}
                  <div className="lg:col-span-2 flex flex-col gap-8">
                    
                    {/* Status Tracking Timeline */}
                    <div className="glass-card p-8 rounded-[2.5rem] bg-slate-50/30 border border-slate-100">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Delivery Progress</h3>
                      
                      <div className="relative flex justify-between">
                        {/* Timeline Bar */}
                        <div className="absolute top-[18px] left-[10%] right-[10%] h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(getStatusInfo(selectedOrder.status).step / 3) * 100}%` }}
                            className="h-full bg-primary"
                          />
                        </div>
                        
                        {/* Timeline Steps */}
                        {[
                          { label: 'Processing', icon: <Clock size={16} />, step: 1 },
                          { label: 'Shipped', icon: <Truck size={16} />, step: 2 },
                          { label: 'Delivered', icon: <CheckCircle2 size={16} />, step: 3 }
                        ].map((item) => (
                          <div key={item.label} className="relative z-10 flex flex-col items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white shadow-md ${
                              getStatusInfo(selectedOrder.status).step >= item.step 
                                ? 'bg-primary text-white scale-110' 
                                : 'bg-slate-100 text-slate-300'
                            }`}>
                              {item.icon}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              getStatusInfo(selectedOrder.status).step >= item.step ? 'text-slate-900' : 'text-slate-300'
                            }`}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Quick Status Update Buttons */}
                      <div className="mt-12 flex flex-wrap gap-3">
                        <p className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Update Order Status:</p>
                        {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(selectedOrder._id, status)}
                            disabled={selectedOrder.status === status || statusUpdating === selectedOrder._id}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                              selectedOrder.status === status 
                                ? getStatusInfo(status).color 
                                : 'bg-white border-slate-200 text-slate-500 hover:border-primary/50'
                            } ${statusUpdating === selectedOrder._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {statusUpdating === selectedOrder._id && selectedOrder.status !== status && <Loader2 className="animate-spin mr-2 inline" size={12} />}
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ordered Products List */}
                    <div className="glass-card p-8 rounded-[2.5rem] border border-slate-100">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ordered Items ({selectedOrder.orderItems?.length})</h3>
                        <p className="text-lg font-black text-slate-900 tracking-tight">Total: ${(selectedOrder.totalPrice || 0).toFixed(2)}</p>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedOrder.orderItems?.map((item, index) => (
                          <div key={index} className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-50 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                            <div className="relative">
                              <img 
                                src={getImageUrl(item.image)} 
                                alt={item.name} 
                                className="w-20 h-20 rounded-2xl object-cover bg-white shadow-sm border border-slate-100"
                              />
                              <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                {item.quantity}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">{item.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{item.category || 'Grocery'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-bold mb-1">${(item.price || 0).toFixed(2)} / unit</p>
                              <p className="text-lg font-black text-slate-900 tracking-tight">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Customer & Shipping */}
                  <div className="flex flex-col gap-8">
                    
                    {/* Customer Profile Card */}
                    <div className="glass-card p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 relative overflow-hidden group">
                      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
                      
                      <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <User size={14} /> Customer Profile
                      </h3>
                      
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary font-black text-xl">
                          {(selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name || 'G')[0]}
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 tracking-tight leading-tight">
                            {selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name || 'Guest User'}
                          </p>
                          <p className="text-xs font-bold text-slate-400">{selectedOrder.user?.email || 'No Email'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-4 border-t border-primary/10">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Clock size={16} className="text-primary/50" />
                          <p className="text-xs font-bold">Ordered {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <CreditCard size={16} className="text-primary/50" />
                          <p className="text-xs font-bold uppercase tracking-widest">{selectedOrder.paymentMethod}</p>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address Card */}
                    <div className="glass-card p-8 rounded-[2.5rem] border border-slate-100">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <MapPin size={14} /> Delivery Address
                      </h3>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-black text-slate-900">{selectedOrder.shippingAddress?.fullName}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {selectedOrder.shippingAddress?.address},<br/>
                          {selectedOrder.shippingAddress?.city},<br/>
                          {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                        </p>
                        <div className="pt-4 mt-4 border-t border-slate-100">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Contact Number</p>
                          <p className="text-sm font-black text-primary tracking-widest">{selectedOrder.shippingAddress?.mobileNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes / Summary */}
                    <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/20">
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Payment Summary</h3>
                       <div className="space-y-4">
                         <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                           <span>Subtotal</span>
                           <span>${(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                           <span>Shipping</span>
                           <span className="text-primary">FREE</span>
                         </div>
                         <div className="h-px bg-white/10 my-4" />
                         <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Paid</span>
                           <span className="text-2xl font-black tracking-tight">${(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                         </div>
                       </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
