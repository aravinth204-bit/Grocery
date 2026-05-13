import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX, Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../services/api';
import { useSearch } from '../context/SearchContext';

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Snacks", "Drinks"];

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const { searchQuery } = useSearch();

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
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-primary"
        >
          <Loader2 size={48} />
        </motion.div>
        <p className="text-gray-400 font-medium animate-pulse">Loading premium groceries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="p-6 rounded-full bg-red-500/10 text-red-500">
          <AlertTriangle size={48} />
        </div>
        <div className="max-w-md">
          <h3 className="text-2xl font-bold mb-2">Connection Error</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-gradient px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 mx-auto"
          >
            <RefreshCcw size={18} /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="products-section" className="py-20 bg-dark-bg min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="text-center md:text-left">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Premium Collection"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              {searchQuery ? "Search Results" : <>Explore <span className="text-gradient">Organic</span></>}
            </h2>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 btn-gradient rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard {...product} />
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
            <div className="p-6 rounded-full bg-white/5 text-gray-600">
              <SearchX size={64} />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-gray-500">
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
