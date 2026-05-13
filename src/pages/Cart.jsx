import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, isEmpty } = useCart();
  const deliveryFee = cartTotal > 50 ? 0 : 5.00;
  const finalTotal = cartTotal + deliveryFee;

  if (isEmpty) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={48} className="text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Looks like you haven't added anything to your premium grocery basket yet.
          </p>
          <Link to="/" className="btn-gradient px-10 py-4 rounded-2xl font-bold text-white inline-flex items-center gap-2">
            Go Shopping <ArrowRight size={20} />
          </Link>
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
          className="text-4xl font-bold mb-12"
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
                  className="glass-card p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 border border-white/5"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-primary font-bold mt-2">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
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
              className="glass p-8 rounded-[2.5rem] border border-white/10 sticky top-32"
            >
              <h2 className="text-2xl font-bold mb-8">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase font-bold">Free</span>
                    )}
                  </div>
                  <span className="text-white">
                    {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <hr className="border-white/5 my-2" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Link to="/checkout" className="btn-gradient w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-primary/20 text-center">
                  Proceed to Checkout
                </Link>
                <Link to="/" className="text-center text-sm text-gray-400 hover:text-white transition-colors">
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
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
