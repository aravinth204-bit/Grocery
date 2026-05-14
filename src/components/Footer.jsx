import React from 'react';
import { ShoppingBasket, Instagram, X, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="pt-24 pb-12 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="p-1 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 overflow-hidden flex items-center justify-center">
                {settings?.storeInfo?.logo ? (
                  <img src={settings.storeInfo.logo} alt="Logo" className="w-10 h-10 object-cover" />
                ) : (
                  <div className="p-1.5"><ShoppingBasket size={24} /></div>
                )}
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
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
            <p className="text-slate-500 leading-relaxed font-medium">
              Experience the future of grocery shopping. Premium organic products delivered with unmatched speed and care from our elite network of farms.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, X, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-3.5 rounded-[1.25rem] bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all shadow-sm border border-slate-100">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="text-lg font-black mb-8 text-slate-900 tracking-tight uppercase tracking-[0.1em]">Quick Links</h4>
            <ul className="flex flex-col gap-5">
              {['Home', 'Categories', 'Special Offers', 'Our Story', 'Help Center'].map((item, i) => (
                <li key={i}>
                  <Link to="#" className="text-slate-500 hover:text-primary transition-all flex items-center gap-2 group font-bold">
                    <span className="w-2 h-0.5 rounded-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-black mb-8 text-slate-900 tracking-tight uppercase tracking-[0.1em]">Contact Us</h4>
            <ul className="flex flex-col gap-7">
              <li className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm">
                  <MapPin size={20} />
                </div>
                <span className="text-slate-600 text-sm font-bold leading-relaxed">
                  {settings?.storeInfo?.address || '123 Luxury Avenue, Organic District, GC 56789'}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm">
                  <Phone size={20} />
                </div>
                <span className="text-slate-600 text-sm font-bold">
                  {settings?.storeInfo?.phone || '+1 (234) 567-890'}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm">
                  <Mail size={20} />
                </div>
                <span className="text-slate-600 text-sm font-bold">
                  {settings?.storeInfo?.email || 'support@freshcart.premium'}
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-black mb-8 text-slate-900 tracking-tight uppercase tracking-[0.1em]">Newsletter</h4>
            <p className="text-sm text-slate-500 mb-8 font-medium">Subscribe to get exclusive access to seasonal drops and organic news.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-slate-50 border border-slate-200 rounded-[1.25rem] py-4.5 pl-6 pr-14 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold placeholder:text-slate-400 shadow-inner"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-primary text-white hover:bg-emerald-600 transition-all shadow-lg shadow-primary/20">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2026 {settings?.storeInfo?.name || 'FreshCart Premium'}. Built for visual excellence.
          </p>
          <div className="flex items-center gap-10">
            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-widest">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
