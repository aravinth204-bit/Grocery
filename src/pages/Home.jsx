import React from 'react';
import Hero from '../components/Hero';
import CategoriesSection from '../components/CategoriesSection';
import ProductsSection from '../components/ProductsSection';
import OfferBanner from '../components/OfferBanner';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <Hero />
      
      {/* Categories Grid */}
      <CategoriesSection />
      
      {/* Popular Products Section */}
      <ProductsSection />
      
      {/* Big Promotion Banner */}
      <OfferBanner />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
