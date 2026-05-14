import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Leaf, Milk, Beef, Egg, Coffee, Carrot, ChevronRight } from 'lucide-react';
import Magnetic from './Magnetic';

import { useSearch } from '../context/SearchContext';

const categories = [
  { name: "Vegetables", icon: <Carrot size={32} />, color: "bg-emerald-500", text: "Fresh from the elite farms" },
  { name: "Fruits", icon: <Apple size={32} />, color: "bg-red-500", text: "Premium organic selection" },
  { name: "Dairy", icon: <Milk size={32} />, color: "bg-blue-500", text: "Farm-fresh purity" },
  { name: "Snacks", icon: <Egg size={32} />, color: "bg-amber-500", text: "Morning fresh elite" },
  { name: "Drinks", icon: <Coffee size={32} />, color: "bg-orange-900", text: "Artisan roasted luxury" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', damping: 15, stiffness: 100 }
  }
};

const CategoriesSection = () => {
  const { setActiveCategory } = useSearch();

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center mb-24 w-full">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6 bg-primary/10 px-6 py-2.5 rounded-2xl border border-primary/20 block w-fit"
          >
            Elite Selection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter w-full text-center"
          >
            Browse by <span className="text-gradient">Category</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-8 max-w-3xl text-xl font-medium leading-relaxed mx-auto text-center"
          >
            Experience the finest organic produce sourced from world-class sustainable farms across the globe.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 max-w-6xl mx-auto"
        >
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -15 }}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <Magnetic>
                <div className={`w-28 h-28 rounded-[3rem] ${cat.color} bg-opacity-10 text-slate-800 flex items-center justify-center mb-8 transition-all duration-700 group-hover:bg-opacity-100 group-hover:text-white border border-slate-50 group-hover:border-transparent relative shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/20`}>
                  <div className="absolute inset-0 rounded-[3rem] bg-current opacity-0 group-hover:opacity-20 blur-2xl transition-opacity"></div>
                  <div className="group-hover:scale-110 transition-transform duration-500 relative z-10">
                    {cat.icon}
                  </div>
                </div>
              </Magnetic>
              <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] group-hover:text-primary transition-colors text-center">{cat.name}</h3>
              <div className="flex items-center justify-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                 <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Explore</span>
                 <ChevronRight size={10} className="text-primary" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
