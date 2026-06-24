import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Magnetic from './Magnetic';
import { useSearch } from '../context/SearchContext';

const categories = [
  { name: "Vegetables", image: "/fruits/avocado.png", text: "Fresh from organic elite local farms.", count: "120+ items", color: "from-green-50 to-white", hover: "hover:border-green-200 hover:shadow-green-100/50" },
  { name: "Fruits", image: "/fruits/apple.png", text: "Premium organic hand-picked selection.", count: "80+ items", color: "from-red-50 to-white", hover: "hover:border-red-200 hover:shadow-red-100/50" },
  { name: "Dairy", image: "/fruits/glass_bowl.png", text: "Pure farm-fresh, organic milk & cheese.", count: "45+ items", color: "from-yellow-50 to-white", hover: "hover:border-yellow-200 hover:shadow-yellow-100/50" },
  { name: "Snacks", image: "/fruits/snacks.svg", text: "Healthy, wholesome morning fresh snacks.", count: "60+ items", color: "from-orange-50 to-white", hover: "hover:border-orange-200 hover:shadow-orange-100/50" },
  { name: "Drinks", image: "/fruits/lemon.png", text: "Artisan roasted coffee & natural juices.", count: "35+ items", color: "from-lime-50 to-white", hover: "hover:border-lime-200 hover:shadow-lime-100/50" },
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
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', damping: 22, stiffness: 120 }
  }
};

const CategoriesSection = () => {
  const { setActiveCategory } = useSearch();

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories-section" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center mb-20 w-full">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6 bg-primary/10 px-6 py-2.5 rounded-2xl border border-primary/20 block w-fit shadow-sm"
          >
            Elite Selection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter w-full text-center"
          >
            Browse by <span className="text-gradient">Category</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-6 max-w-3xl text-base md:text-lg font-medium leading-relaxed mx-auto text-center"
          >
            Experience the finest organic produce sourced from world-class sustainable farms across the globe.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto"
        >
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onClick={() => handleCategoryClick(cat.name)}
              className={`relative group overflow-hidden bg-gradient-to-b ${cat.color} border border-slate-200/60 rounded-[2rem] p-8 flex flex-col gap-4 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] ${cat.hover} hover:border-opacity-100`}
            >
              {/* Image */}
              <div className="w-full flex justify-center items-center h-28">
                <motion.img
                  src={cat.image}
                  alt={cat.name}
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="h-24 w-24 object-contain drop-shadow-xl"
                />
              </div>

              {/* Count badge */}
              <div className="flex justify-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 group-hover:bg-primary/15 group-hover:text-primary px-3 py-1.5 rounded-full transition-all">
                  {cat.count}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-primary transition-colors tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed group-hover:text-slate-500 transition-colors">
                  {cat.text}
                </p>
              </div>

              {/* Action Link */}
              <div className="flex items-center gap-2 text-xs font-black text-primary tracking-widest uppercase mt-2">
                <span>Explore</span>
                <ChevronRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/15 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
