import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Leaf, Beef, Milk, Croissant, Coffee } from 'lucide-react';

const categories = [
  { name: "Fruits", icon: <Apple size={32} />, count: "120+ Items", color: "from-red-500/20 to-orange-500/20" },
  { name: "Veggies", icon: <Leaf size={32} />, count: "80+ Items", color: "from-green-500/20 to-emerald-500/20" },
  { name: "Meat", icon: <Beef size={32} />, count: "45+ Items", color: "from-red-700/20 to-pink-700/20" },
  { name: "Dairy", icon: <Milk size={32} />, count: "60+ Items", color: "from-blue-500/20 to-cyan-500/20" },
  { name: "Bakery", icon: <Croissant size={32} />, count: "30+ Items", color: "from-yellow-600/20 to-orange-600/20" },
  { name: "Beverages", icon: <Coffee size={32} />, count: "95+ Items", color: "from-purple-500/20 to-blue-500/20" },
];

const CategoriesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Browse by <span className="text-gradient">Category</span></h2>
          <p className="text-gray-400">Explore our wide range of premium organic products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
            >
              <div className={`glass-card p-8 rounded-[2rem] flex flex-col items-center gap-4 border border-white/5 group-hover:border-primary/50 transition-all duration-500 relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="p-4 rounded-2xl bg-white/5 text-white group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500 relative z-10">
                  {cat.icon}
                </div>
                <div className="text-center relative z-10">
                  <h3 className="font-bold text-white text-lg">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
