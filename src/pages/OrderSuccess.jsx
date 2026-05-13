import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Clock, ShoppingBag, ArrowRight, MapPin } from 'lucide-react';
import useCart from '../hooks/useCart';

const OrderSuccess = () => {
  const { id } = useParams();
  const { clearCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Clear the cart only after reaching the success page
    clearCart();
  }, []);

  // Calculate estimated delivery (Current time + 2 hours)
  const deliveryTime = new Date();
  deliveryTime.setHours(deliveryTime.getHours() + 2);
  const formattedTime = deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-dark-bg flex items-center justify-center">
      <div className="container mx-auto max-w-2xl relative">
        
        {/* Background Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 md:p-16 rounded-[3.5rem] border border-white/10 shadow-2xl relative z-10 text-center"
        >
          {/* Animated Check Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
            className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/30"
          >
            <CheckCircle2 size={48} className="text-white" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Order <span className="text-gradient">Placed!</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-lg mb-12"
          >
            Your organic groceries are being hand-picked with care.
          </motion.p>

          {/* Order Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
          >
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-left">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Package size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Order ID</span>
              </div>
              <p className="text-sm font-mono text-gray-300 truncate">#{id}</p>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-left">
              <div className="flex items-center gap-3 text-secondary mb-2">
                <Clock size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Estimated Delivery</span>
              </div>
              <p className="text-lg font-bold text-white">Today, by {formattedTime}</p>
            </div>
          </motion.div>

          {/* Delivery Progress Preview */}
          <div className="mb-12">
            <div className="flex justify-between mb-4 px-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Confirmed</span>
              </div>
              <div className="flex-1 h-0.5 bg-white/10 mt-5 mx-2 relative overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 1, delay: 1 }}
                  className="absolute inset-0 bg-primary"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-500">
                  <Package size={18} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Packing</span>
              </div>
              <div className="flex-1 h-0.5 bg-white/10 mt-5 mx-2" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-500">
                  <Truck size={18} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">On Way</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/" 
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} /> Continue Shopping
            </Link>
            <Link 
              to="/my-orders"
              className="flex-1 btn-gradient py-4 rounded-2xl font-bold text-white shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
            >
              Track Order <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-gray-500 text-xs">
            <MapPin size={14} className="text-primary" />
            <span>Delivery to your saved primary address</span>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
