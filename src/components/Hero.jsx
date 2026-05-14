import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Magnetic from './Magnetic';

const banners = [
  {
    title: "Freshness",
    subtitle: "Redefined.",
    tagline: "Elite Organic Delivery Service",
    description: "Sourced from world-class organic farms. Delivered with white-glove precision.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
    color: "primary"
  },
  {
    title: "Premium",
    subtitle: "Selection.",
    tagline: "World Class Quality",
    description: "The finest hand-picked organic produce delivered directly to your doorstep.",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=1000",
    color: "secondary"
  },
  {
    title: "Eco-Friendly",
    subtitle: "Living.",
    tagline: "Sustainable Heritage",
    description: "100% plastic-free packaging and carbon-neutral elite delivery services.",
    image: "https://images.unsplash.com/photo-1466632348570-84803b1d5840?auto=format&fit=crop&q=80&w=1000",
    color: "emerald-600"
  }
];

const Hero = () => {
  const { settings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 50;
    const y = (clientY - window.innerHeight / 2) / 50;
    setMousePos({ x, y });
  };

  const currentBanner = banners[currentIndex];

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-white"
    >
      {/* Background Gradients with Parallax */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <motion.div 
          animate={{ 
            x: mousePos.x * -1, 
            y: mousePos.y * -1,
          }}
          className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: mousePos.x, 
            y: mousePos.y,
          }}
          className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full"
        ></motion.div>
      </div>

      <div className="container mx-auto px-6 h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[70vh]"
          >
            {/* Content Side */}
            <div className="flex flex-col gap-10 text-center lg:text-left relative z-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-md border border-white w-fit px-5 py-2 rounded-2xl mx-auto lg:mx-0 shadow-sm"
              >
                <div className={`w-2 h-2 rounded-full bg-${currentBanner.color} animate-ping`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {currentBanner.tagline}
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl font-black leading-[1] text-slate-900 tracking-tight"
              >
                {currentBanner.title} <br />
                <span className="text-gradient">{currentBanner.subtitle}</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-500 text-lg md:text-2xl max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
              >
                {currentBanner.description}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              >
                <Magnetic>
                  <button 
                    onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-gradient px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-white flex items-center gap-3 w-full sm:w-auto justify-center group shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all"
                  >
                    Shop Collection 
                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </Magnetic>
                <Magnetic>
                  <button 
                    onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })}
                    className="px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-slate-600 border border-slate-200 hover:bg-white transition-all w-full sm:w-auto shadow-sm"
                  >
                    Our Story
                  </button>
                </Magnetic>
              </motion.div>
            </div>

            {/* Image Side with Parallax */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative order-first lg:order-last"
            >
              {/* Floating Card UI Element */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  x: mousePos.x * 2,
                }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-10 -left-5 z-30 glass-card p-6 rounded-[2.5rem] flex items-center gap-4 hidden xl:flex border border-white shadow-2xl bg-white/60"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                  <Star size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rating</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">4.9/5.0 Elite</p>
                </div>
              </motion.div>

              {/* Main Image Wrapper with Parallax */}
              <motion.div 
                animate={{ 
                  x: mousePos.x * 1.5,
                  y: mousePos.y * 1.5,
                  rotateX: mousePos.y * -0.5,
                  rotateY: mousePos.x * 0.5,
                }}
                className="relative group perspective-1000"
              >
                <div className={`absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-75`}></div>
                <div className="relative z-10 w-full max-w-xl mx-auto aspect-square rounded-[4rem] overflow-hidden shadow-[0_50px_50px_rgba(0,0,0,0.15)] border-[12px] border-white/50 backdrop-blur-sm">
                  <motion.img 
                    key={currentBanner.image}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={currentBanner.image} 
                    alt={currentBanner.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-40">
          {banners.map((_, index) => (
            <Magnetic key={index}>
              <button
                onClick={() => setCurrentIndex(index)}
                className="group p-2 flex items-center justify-center"
              >
                <div className={`transition-all duration-500 rounded-full ${
                  currentIndex === index 
                    ? 'w-12 h-2.5 bg-primary shadow-lg shadow-primary/40' 
                    : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-400'
                }`} />
              </button>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
