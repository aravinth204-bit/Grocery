import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX, Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../services/api';
import { useSearch } from '../context/SearchContext';

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Snacks", "Drinks"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery, activeCategory, setActiveCategory } = useSearch();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();
        // Backend returns { success: true, count: X, data: [...] }
        setProducts(data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please check if the backend server is running.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-primary">
             <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Elite Collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="p-8 rounded-[2rem] bg-red-500/10 text-red-500 shadow-inner">
          <AlertTriangle size={56} />
        </div>
        <div className="max-w-md">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Sync Interrupted</h3>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-gradient px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white flex items-center gap-3 mx-auto shadow-2xl shadow-primary/20"
          >
            <RefreshCcw size={18} /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="products-section" className="py-32 bg-slate-50/50 min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20 gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 inline-block bg-primary/10 px-6 py-2 rounded-2xl border border-primary/20"
            >
              {searchQuery ? `Search Results for "${searchQuery}"` : "The Collection"}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter"
            >
              {searchQuery ? "Global Search" : <>Premium <span className="text-gradient">Organic</span></>}
            </motion.h2>
          </div>

          {/* Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-x-auto max-w-full no-scrollbar"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                  activeCategory === cat ? 'text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 btn-gradient rounded-[1.5rem] shadow-lg shadow-primary/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Products Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
              >
                <ProductCard 
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  rating={product.rating}
                  category={product.category}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center flex flex-col items-center gap-6"
          >
            <div className="p-6 rounded-full bg-slate-100 text-slate-400">
              <SearchX size={64} />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold mb-2 text-slate-900">No results found</h3>
              <p className="text-slate-500">
                We couldn't find any products matching "{searchQuery}" in the {activeCategory === "All" ? "" : activeCategory} category.
              </p>
            </div>
            <button 
              onClick={() => {
                setActiveCategory("All");
              }}
              className="text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
