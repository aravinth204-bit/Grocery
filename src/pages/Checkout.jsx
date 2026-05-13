import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Banknote, Truck, ArrowLeft, ShieldCheck, MapPin, Phone, User, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, isEmpty } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    address: '',
    city: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const deliveryFee = cartTotal > 50 ? 0 : 5.00;
  const grandTotal = cartTotal + deliveryFee;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated) {
      showToast("Please login to proceed with checkout", "error");
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    if (isEmpty && !loading) {
      navigate('/cart');
    }
  }, [isEmpty, navigate, isAuthenticated, loading]);

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item.id // This is the MongoDB _id
        })),
        shippingAddress: {
          address: shippingData.address,
          city: shippingData.city,
          pincode: shippingData.pincode,
          mobile: shippingData.mobile
        },
        paymentMethod,
        totalPrice: grandTotal
      };

      const res = await createOrder(orderData);
      
      if (res.data.success) {
        showToast("Order placed successfully!");
        navigate(`/order-success/${res.data.data._id}`);
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to place order. Please try again.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-dark-bg">
      <div className="container mx-auto max-w-6xl">
        
        <Link to="/cart" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Shipping & Payment Section */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Delivery Address Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 sm:p-10 rounded-[2.5rem] border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <MapPin size={24} />
                </div>
                Delivery Address
              </h2>
              
              <form 
                id="checkout-form" 
                onSubmit={handlePlaceOrder}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <div className="sm:col-span-2 relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={shippingData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="tel" 
                    name="mobile"
                    required
                    value={shippingData.mobile}
                    onChange={handleInputChange}
                    placeholder="Mobile Number"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    name="pincode"
                    required
                    value={shippingData.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="sm:col-span-2 relative">
                  <input 
                    type="text" 
                    name="address"
                    required
                    value={shippingData.address}
                    onChange={handleInputChange}
                    placeholder="Complete Address (Street, Building, Flat No)"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="sm:col-span-2 relative">
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={shippingData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </form>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 sm:p-10 rounded-[2.5rem] border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <CreditCard size={24} />
                </div>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-4 text-left ${
                    paymentMethod === 'cod' 
                    ? 'border-primary bg-primary/5 text-white' 
                    : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Banknote size={32} className={paymentMethod === 'cod' ? 'text-primary' : 'text-gray-500'} />
                  <div>
                    <p className="font-bold">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 mt-1">Pay when you receive the order</p>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('online')}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-4 text-left ${
                    paymentMethod === 'online' 
                    ? 'border-primary bg-primary/5 text-white' 
                    : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <CreditCard size={32} className={paymentMethod === 'online' ? 'text-primary' : 'text-gray-500'} />
                  <div>
                    <p className="font-bold">Online Payment</p>
                    <p className="text-xs text-gray-500 mt-1">Pay via UPI, Card, or Netbanking</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[2.5rem] border border-white/10 sticky top-32"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <ShoppingBag size={24} />
                </div>
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-300">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 py-6 border-y border-white/5 mb-8">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-primary font-bold">
                    {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2">
                  <span>Total</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="btn-gradient w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Place Order <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Your payment and details are 100% secure</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Truck size={16} className="text-primary" />
                  <span>Guaranteed fresh delivery within 2 hours</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple internal icon for the button arrow
const ArrowRight = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

export default Checkout;
