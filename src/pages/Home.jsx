import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CategoriesSection from '../components/CategoriesSection';
import ProductsSection from '../components/ProductsSection';
import OfferBanner from '../components/OfferBanner';
import Footer from '../components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <Hero />
      
      {/* Categories Grid */}
      <CategoriesSection />
      
      {/* Popular Products Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <ProductsSection />
      </motion.div>
      
      {/* Big Promotion Banner */}
      <OfferBanner />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
