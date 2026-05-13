import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <SearchProvider>
          <ToastProvider>
            <CartProvider>
              <Router>
                <div className="min-h-screen bg-dark-bg text-white selection:bg-primary selection:text-white">
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-success/:id" element={<OrderSuccess />} />
                      <Route path="/my-orders" element={<MyOrders />} />
                    </Routes>
                  </main>
                </div>
              </Router>
            </CartProvider>
          </ToastProvider>
        </SearchProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
