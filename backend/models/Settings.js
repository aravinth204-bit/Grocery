import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  storeInfo: {
    name: { type: String, default: 'FreshCart Store' },
    email: { type: String, default: 'contact@freshcart.com' },
    phone: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: '123 Grocery Lane, Chennai, India' },
    gst: { type: String, default: '' },
    logo: { type: String, default: '' },
  },
  delivery: {
    charge: { type: Number, default: 40 },
    freeLimit: { type: Number, default: 500 },
    radius: { type: Number, default: 10 },
    time: { type: String, default: '30-45 mins' },
  },
  payments: {
    cod: { type: Boolean, default: true },
    razorpay: { type: Boolean, default: false },
    upi: { type: Boolean, default: true },
  },
  notifications: {
    email: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: false },
    alerts: { type: Boolean, default: true },
  },
  seo: {
    title: { type: String, default: 'FreshCart - Premium Online Grocery Store' },
    description: { type: String, default: 'Order fresh groceries online.' },
    keywords: { type: String, default: 'groceries, fresh fruits' },
  },
  banners: {
    home: { type: String, default: '' },
    offer: { type: String, default: '' },
  },
  theme: {
    darkMode: { type: Boolean, default: true },
    primaryColor: { type: String, default: '#10b981' },
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
