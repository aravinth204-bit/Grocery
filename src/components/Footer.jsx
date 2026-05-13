import React from 'react';
import { ShoppingBasket, Instagram, X, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="pt-20 pb-10 bg-[#050505] border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="p-1 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 overflow-hidden flex items-center justify-center">
                {settings?.storeInfo?.logo ? (
                  <img src={settings.storeInfo.logo} alt="Logo" className="w-10 h-10 object-cover" />
                ) : (
                  <div className="p-1"><ShoppingBasket size={24} /></div>
                )}
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {settings?.storeInfo?.name ? (
                  <>
                    {settings.storeInfo.name.split(' ')[0]}
                    <span className="text-primary"> {settings.storeInfo.name.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  <>Fresh<span className="text-primary">Cart</span></>
                )}
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Experience the future of grocery shopping. Premium organic products delivered with unmatched speed and care.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, X, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-primary/20 hover:text-primary transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {['Home', 'Categories', 'Special Offers', 'Our Story', 'Help Center'].map((item, i) => (
                <li key={i}>
                  <Link to="#" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-primary">
                  <MapPin size={18} />
                </div>
                <span className="text-gray-400 text-sm">
                  {settings?.storeInfo?.address || '123 Luxury Avenue, Organic District, Green City, GC 56789'}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-primary">
                  <Phone size={18} />
                </div>
                <span className="text-gray-400 text-sm">
                  {settings?.storeInfo?.phone || '+1 (234) 567-890'}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-primary">
                  <Mail size={18} />
                </div>
                <span className="text-gray-400 text-sm">
                  {settings?.storeInfo?.email || 'support@freshcart.premium'}
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-6">Subscribe to get special offers and organic news.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-gray-500 text-sm">
            © 2026 {settings?.storeInfo?.name || 'FreshCart Premium'}. All rights reserved. Designed with ❤️ by Antigravity.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
