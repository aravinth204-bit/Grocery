import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, Heart } from 'lucide-react';
import useCart from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

import { getImageUrl } from '../utils/imageUrl';
import Magnetic from './Magnetic';

const ProductCard = ({ id, name, price, image, rating, category }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  
  const handleAdd = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the add button
    addToCart({ id, name, price, image, rating, category });
    showToast(`${name} added to cart!`);
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleNavigate}
      className="glass-card rounded-2xl overflow-hidden group border border-slate-100 hover:border-primary/20 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-xl flex flex-col h-full perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-3 transition-transform duration-500 group-hover:scale-105" style={{ transform: 'translateZ(30px)' }}>
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
          </div>
        )}

        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          onLoad={() => setImageLoaded(true)}
          transition={{ duration: 0.8 }}
          src={getImageUrl(image)}
          alt={name}
          className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-white/90 backdrop-blur-md text-primary text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-[0.1em] border border-slate-100 shadow-sm">
            {category}
          </span>
        </div>

        {/* Wishlist Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-300 hover:text-red-500 transition-all duration-300 border border-slate-100 shadow-sm"
        >
          <Heart size={12} />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-center gap-0.5 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={9} 
              fill={i < Math.floor(rating) ? "#fbbf24" : "none"} 
              className={i < Math.floor(rating) ? "text-amber-400" : "text-slate-200"} 
            />
          ))}
          <span className="text-[8px] font-black text-slate-400 ml-1">({rating})</span>
        </div>

        <h3 className="text-xs font-black text-slate-900 mb-0.5 group-hover:text-primary transition-colors line-clamp-1 tracking-tight leading-tight">
          {name}
        </h3>
        <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-2">Premium</p>
        
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-300 line-through tracking-[0.1em] mb-0.5">
              ${(price * 1.2).toFixed(2)}
            </span>
            <span className="text-sm font-black text-slate-900 tracking-tighter">
              ${price.toFixed(2)}
            </span>
          </div>

          <Magnetic>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#059669' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              <Plus size={14} strokeWidth={3} />
            </motion.button>
          </Magnetic>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
