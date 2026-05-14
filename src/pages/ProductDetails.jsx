import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import useCart from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        
        // Fetch current product
        const productRes = await fetchProductById(id);
        const currentProduct = productRes.data.data;
        setProduct(currentProduct);

        // Fetch all products for related section
        const allRes = await fetchProducts();
        const related = allRes.data.data
          .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
        
        setError(null);
      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProductData();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showToast(`${quantity} ${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="text-primary">
          <Loader2 size={48} />
        </motion.div>
        <p className="text-gray-400">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="p-6 rounded-full bg-red-500/10 text-red-500">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-2xl font-bold">Oops! Product not found</h2>
        <p className="text-gray-500 max-w-sm">The product you are looking for might have been removed or the server is down.</p>
        <Link to="/" className="btn-gradient px-8 py-3 rounded-xl font-bold text-white">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-dark-bg">
      <div className="container mx-auto max-w-6xl">
        
        <Link 
          to="/"
          className="relative z-[20] inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all mb-10 group cursor-pointer backdrop-blur-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-tight">Back to browsing</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-[3rem] overflow-hidden bg-white/5 border border-white/5"
          >
            <img src={getImageUrl(product.image)} alt={product.name} className="w-full aspect-square object-cover p-12" />
            <div className="absolute top-6 left-6">
              <span className="bg-primary/20 backdrop-blur-md text-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-primary/20">
                {product.category}
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({product.rating} Customer Rating)</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed border-l-4 border-primary/30 pl-6 py-2">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <div className="flex items-center gap-6 bg-white/5 p-2 rounded-2xl border border-white/5 w-full sm:w-auto justify-between sm:justify-start">
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                  <Minus size={20} />
                </button>
                <span className="font-black text-xl w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)} className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                  <Plus size={20} />
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn-gradient flex-1 sm:flex-none px-12 py-5 rounded-2xl font-bold text-white flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                <ShoppingCart size={22} /> Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Truck size={24} className="text-primary" />
                <p className="text-xs font-bold uppercase tracking-wider">Fast Delivery</p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <ShieldCheck size={24} className="text-primary" />
                <p className="text-xs font-bold uppercase tracking-wider">Organic Certified</p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <RefreshCw size={24} className="text-primary" />
                <p className="text-xs font-bold uppercase tracking-wider">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">Related <span className="text-gradient">Products</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => <ProductCard key={p.id} {...p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
