import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Heart } from 'lucide-react';
import useCart from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, name, price, image, rating, category }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const handleAdd = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the add button
    addToCart({ id, name, price, image, rating, category });
    showToast(`${name} added to cart!`);
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };
  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={handleNavigate}
      className="glass-card rounded-[2.5rem] overflow-hidden group border border-white/5 hover:border-primary/30 transition-colors duration-500 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          src={image}
          alt={name}
          className="w-full h-full object-cover p-6"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-dark-bg/80 backdrop-blur-md text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/5">
            {category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/5 backdrop-blur-md text-white hover:bg-red-500 hover:text-white transition-all duration-300 border border-white/5">
          <Heart size={16} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              fill={i < Math.floor(rating) ? "#f59e0b" : "none"} 
              className={i < Math.floor(rating) ? "text-secondary" : "text-gray-600"} 
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating})</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 line-through tracking-tighter">
              ${(price * 1.2).toFixed(2)}
            </span>
            <span className="text-xl font-bold text-white">
              ${price.toFixed(2)}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            <Plus size={20} strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
