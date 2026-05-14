import React from 'react';
import { motion } from 'framer-motion';
import { Tag, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';
import Magnetic from './Magnetic';

const OfferBanner = () => {
  return (
    <section id="offer-banner" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3.5rem] overflow-hidden bg-gradient-to-r from-slate-50 to-white border border-slate-100 p-10 md:p-24 shadow-2xl shadow-slate-200/50"
        >
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-secondary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col gap-10 text-center lg:text-left">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-2.5 rounded-2xl w-fit mx-auto lg:mx-0 border border-primary/20 shadow-sm"
              >
                <Tag size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusive Membership Offer</span>
              </motion.div>
              
              <h2 className="text-5xl md:text-8xl font-black leading-[0.9] text-slate-900 tracking-tighter">
                Elite <span className="text-gradient">Savings</span> <br />
                Await You.
              </h2>
              
              <p className="text-slate-500 text-lg md:text-2xl max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Experience the pinnacle of organic freshness. Join our elite circle and enjoy 30% off your first delivery.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start">
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                  <span className="relative text-slate-900 font-black text-2xl tracking-[0.4em] px-10 py-5 bg-white rounded-[1.8rem] border border-slate-200 block shadow-sm uppercase">
                    FRESH30
                  </span>
                </div>
                <Magnetic>
                  <button 
                    onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-gradient px-14 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-white flex items-center gap-4 group shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all"
                  >
                    Claim Offer <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </Magnetic>
              </div>
              
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">*Elite delivery service available in select regions</p>
            </div>

            <div className="hidden lg:flex justify-center relative">
               <motion.div
                 animate={{ rotate: [0, 3, 0], y: [0, -10, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="relative z-10 w-full max-w-md"
               >
                 <div className="glass p-10 rounded-[3.5rem] border border-white shadow-[0_40px_80px_rgba(0,0,0,0.08)] bg-white/40">
                    <div className="flex flex-col gap-6">
                       <div className="w-full h-56 bg-slate-100 rounded-3xl overflow-hidden relative group shadow-inner">
                          <img 
                            src={getImageUrl("https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=60")} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                            alt="Offer Product"
                          />
                          <div className="absolute top-5 right-5 bg-primary text-white font-black px-4 py-2 rounded-2xl text-xs shadow-lg">
                            -30%
                          </div>
                       </div>
                       <div className="flex justify-between items-center px-2">
                          <div>
                             <h4 className="font-black text-xl text-slate-900 tracking-tight">Fresh Veggie Box</h4>
                             <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Premium Subscription</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs text-slate-400 line-through font-bold tracking-tighter mb-1">$45.00</p>
                             <p className="text-2xl font-black text-primary">$31.50</p>
                          </div>
                       </div>
                    </div>
                 </div>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferBanner;
