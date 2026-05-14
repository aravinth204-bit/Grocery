import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${apiUrl}/messages`, formData);
      if (res.data.success) {
        showToast('Message sent successfully! We will get back to you soon.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <Phone size={24} />, title: 'Phone', detail: '+91 98765 43210', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: <Mail size={24} />, title: 'Email', detail: 'support@freshcart.com', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: <MapPin size={24} />, title: 'Address', detail: '123 Grocery Lane, Chennai, TN', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: <Clock size={24} />, title: 'Working Hours', detail: 'Mon - Sun: 9AM - 10PM', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
          >
            <MessageSquare size={16} />
            Contact Support
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Get in <span className="text-primary italic">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg"
          >
            Have a question about your order or our services? Our team is here to help you 24/7.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${info.bg} ${info.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {info.icon}
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{info.title}</h3>
                <p className="text-lg font-bold text-slate-900 tracking-tight">{info.detail}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 p-8 md:p-12 rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  required
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-3xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Send Message Now
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
