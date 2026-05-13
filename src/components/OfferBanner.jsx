import React from 'react';
import { motion } from 'framer-motion';
import { Tag, ArrowRight } from 'lucide-react';

const OfferBanner = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 p-8 md:p-16"
        >
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full w-fit mx-auto lg:mx-0">
                <Tag size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Limited Time Offer</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                Get <span className="text-primary">30% OFF</span> on your <br />
                First Order!
              </h2>
              <p className="text-gray-400 text-lg max-w-lg mx-auto lg:mx-0">
                Use code <span className="text-white font-bold tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/10">FRESH30</span> at checkout. 
                Free delivery on orders over $50.
              </p>
              <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                <button className="btn-gradient px-10 py-4 rounded-2xl font-bold text-white flex items-center gap-2 group">
                  Claim Offer <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-sm text-gray-500 italic">*Terms & Conditions apply</p>
              </div>
            </div>

            <div className="hidden lg:flex justify-center relative">
               <motion.div
                 animate={{ rotate: [0, 5, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="relative z-10"
               >
                 <div className="glass p-8 rounded-[3rem] border border-white/20 shadow-2xl">
                    <div className="flex flex-col gap-4">
                       <div className="w-full h-48 bg-white/5 rounded-2xl overflow-hidden relative group">
                          <img 
                            src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=60" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            alt="Offer Product"
                          />
                          <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-lg text-sm">
                            -30%
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div>
                             <h4 className="font-bold text-lg">Fresh Veggie Box</h4>
                             <p className="text-sm text-gray-400">Monthly Subscription</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs text-gray-500 line-through">$45.00</p>
                             <p className="text-xl font-bold text-primary">$31.50</p>
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
