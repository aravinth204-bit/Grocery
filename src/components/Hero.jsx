import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getImageUrl } from '../utils/imageUrl';
import Magnetic from './Magnetic';

const DEFAULT_BANNERS = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1600&auto=format&fit=crop&q=80'
];

const Hero = () => {
  const { settings } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeBanners = [];
  if (settings?.banners?.home1) activeBanners.push(getImageUrl(settings.banners.home1));
  if (settings?.banners?.home2) activeBanners.push(getImageUrl(settings.banners.home2));
  if (settings?.banners?.home3) activeBanners.push(getImageUrl(settings.banners.home3));

  if (activeBanners.length === 0) {
    activeBanners.push(...DEFAULT_BANNERS);
  }

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center bg-slate-950">
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-full z-0">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={activeBanners[currentSlide]}
              alt={`Hero Background ${currentSlide + 1}`}
              className="w-full h-full object-cover select-none"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlay Dark Gradients for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10" />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 h-full flex items-center justify-start relative z-20">
        <div className="w-full max-w-3xl pt-24 lg:pt-0">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex flex-col gap-6 lg:gap-8 text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 w-fit px-5 py-2 rounded-2xl mx-auto lg:mx-0 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                Elite Organic Delivery Service
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] text-white tracking-tighter">
              Freshness <br />
              <span className="text-gradient">Redefined.</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-lg lg:text-xl font-medium leading-relaxed">
              Sourced from world-class organic farms. Delivered with white-glove precision. Browse our collection to fill your bowl with pure freshness.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 justify-center lg:justify-start">
              <Magnetic>
                <button 
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-gradient px-10 py-4 rounded-2xl lg:rounded-[2rem] font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] text-white flex items-center gap-3 w-full sm:w-auto justify-center group shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                  Shop Collection 
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
              </Magnetic>
              <Magnetic>
                <button 
                  onClick={() => {
                    const element = document.getElementById('categories-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.scrollTo({ top: window.innerHeight * 1.2, behavior: 'smooth' });
                    }
                  }}
                  className="px-10 py-4 rounded-2xl lg:rounded-[2rem] font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] text-white border border-white/20 hover:bg-white/10 transition-all w-full sm:w-auto shadow-sm"
                >
                  Explore Categories
                </button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slider Indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-500 border border-white/20 ${currentSlide === index ? 'bg-primary border-primary px-4' : 'bg-white/30 hover:bg-white/60'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
