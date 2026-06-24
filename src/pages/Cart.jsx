import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import usePageTitle from '../hooks/usePageTitle';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, isEmpty } = useCart();
  usePageTitle('My Cart');
  const deliveryFee = cartTotal > 50 ? 0 : 5.00;
  const finalTotal = cartTotal + deliveryFee;

  if (isEmpty) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-md"
        >
          {/* Animated cart illustration */}
          <div className="relative mx-auto w-48 h-48 mb-10">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex items-center justify-center w-full h-full"
            >
              <img src="/fruits/bowl.png" alt="empty cart" className="w-36 h-36 object-contain drop-shadow-2xl opacity-60" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-4 right-4 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <ShoppingBag size={20} className="text-primary" />
            </motion.div>
          </div>

          <h2 className="text-4xl font-black mb-3 text-slate-800 tracking-tight">Your cart is <span className="text-gradient">empty</span></h2>
          <p className="text-slate-500 mb-10 font-medium leading-relaxed">
            Looks like you haven't added anything yet. Explore our premium organic collection!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-gradient px-10 py-4 rounded-2xl font-black text-white inline-flex items-center gap-2 shadow-xl shadow-primary/20 justify-center">
              Start Shopping <ArrowRight size={18} />
            </Link>
            <Link to="/#categories-section" className="px-10 py-4 rounded-2xl font-black text-slate-600 border border-slate-200 bg-white hover:border-primary/30 hover:text-primary transition-all inline-flex items-center gap-2 justify-center">
              Browse Categories
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold mb-12 text-slate-800"
        >
          Your Shopping <span className="text-gradient">Cart</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="glass-card p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-400">{item.category}</p>
                    <p className="text-primary font-bold mt-2">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 hover:bg-slate-200/50 rounded-xl transition-colors text-slate-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold w-4 text-center text-slate-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 hover:bg-slate-200/50 rounded-xl transition-colors text-slate-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-lg text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[2.5rem] sticky top-32"
            >
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase font-bold">Free</span>
                    )}
                  </div>
                  <span className="text-slate-800 font-bold">
                    {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <hr className="border-slate-100 my-2" />
                <div className="flex justify-between text-xl font-bold text-slate-800">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Link to="/checkout" className="btn-gradient w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-primary/20 text-center">
                  Proceed to Checkout
                </Link>
                <Link to="/" className="text-center text-sm text-slate-400 hover:text-slate-700 transition-colors">
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Truck size={16} className="text-primary" />
                  <span>Free delivery on orders over $50.00</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Secure 256-bit SSL encrypted payment</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
