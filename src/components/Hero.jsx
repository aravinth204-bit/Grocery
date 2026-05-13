import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import heroImgDefault from '../assets/hero-grocery.png';

const Hero = () => {
  const { settings } = useSettings();
  const heroImg = settings?.banners?.home || heroImgDefault;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8 text-center lg:text-left"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 w-fit px-4 py-1.5 rounded-full mx-auto lg:mx-0"
          >
            <Star className="text-secondary" size={14} fill="currentColor" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              #1 Premium Grocery Delivery in Town
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1]">
            Experience the <br />
            <span className="text-gradient">Luxury of Freshness</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Sourced directly from elite organic farms. Delivered to your doorstep with 
            white-glove service and unmatched quality.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button className="btn-gradient px-8 py-4 rounded-2xl font-bold text-white flex items-center gap-2 w-full sm:w-auto justify-center group">
              Start Shopping 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-2xl font-bold text-white border border-white/10 hover:bg-white/5 transition-all w-full sm:w-auto">
              View Categories
            </button>
          </div>

          {/* Stats/Badges */}
          <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start mt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <ShieldCheck size={18} />
              </div>
              <span className="text-sm font-medium text-gray-400">100% Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <Zap size={18} />
              </div>
              <span className="text-sm font-medium text-gray-400">{settings?.delivery?.time || '30 Min'} Delivery</span>
            </div>
          </div>
        </motion.div>

        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Floating Card UI Element */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -left-10 z-20 glass-card p-4 rounded-2xl flex items-center gap-3 hidden md:flex"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Customer Rating</p>
              <p className="text-sm font-bold">4.9/5.0 Overall</p>
            </div>
          </motion.div>

          {/* Main Image Wrapper */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 group-hover:scale-90 transition-transform duration-700"></div>
            <motion.img 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              src={heroImg} 
              alt="Premium Grocery Basket" 
              className="relative z-10 w-full max-w-lg mx-auto drop-shadow-[0_35px_35px_rgba(16,185,129,0.3)] rounded-3xl"
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/20 blur-[60px] rounded-full animate-pulse"></div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
