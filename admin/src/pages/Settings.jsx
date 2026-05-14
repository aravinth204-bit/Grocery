import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  Truck, 
  CreditCard, 
  Bell, 
  Image as ImageIcon, 
  Palette, 
  Search, 
  User, 
  Save, 
  Upload,
  Globe,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getSettings, updateSettings, uploadImage } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const SettingsCard = ({ title, icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 md:p-8 rounded-[2.5rem] flex flex-col gap-6"
  >
    <div className="flex items-center gap-3 text-primary">
      <div className="p-3 bg-primary/10 rounded-2xl">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </motion.div>
);

const InputGroup = ({ label, type = "text", placeholder, value, onChange, icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">{icon}</div>}
      <input 
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-slate-100 border border-slate-200 rounded-xl py-3 ${icon ? 'pl-12' : 'px-4'} pr-4 text-slate-900 focus:outline-none focus:border-primary/50 focus:bg-white transition-all placeholder:text-slate-400`}
      />
    </div>
  </div>
);

const Toggle = ({ label, enabled, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
    <span className="text-sm font-medium text-slate-600">{label}</span>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-primary' : 'bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [settings, setSettings] = useState({
    storeInfo: { name: '', email: '', phone: '', address: '', gst: '', logo: '' },
    delivery: { charge: 0, freeLimit: 0, radius: 0, time: '' },
    payments: { cod: true, razorpay: false, upi: true },
    notifications: { email: true, whatsapp: false, alerts: true },
    seo: { title: '', description: '', keywords: '' },
    banners: { home: '', offer: '' },
    theme: { darkMode: true, primaryColor: '#10b981' }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingField(`${section}.${field}`);
    try {
      const { data } = await uploadImage(formData);
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: data.image
        }
      }));
      showToast('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateSettings(settings);
      if (res.data.success) {
        showToast('Settings saved successfully!');
      }
    } catch (error) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-primary">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-32 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 z-[100] px-6 py-3 rounded-2xl border flex items-center gap-3 shadow-2xl backdrop-blur-xl ${
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Manage your store configuration, themes, and admin profile.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="hidden md:flex items-center gap-2 bg-primary hover:bg-emerald-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* 1. Store Information */}
        <SettingsCard title="Store Information" icon={<Store size={24} />} delay={0.1}>
          <InputGroup label="Store Name" value={settings.storeInfo.name} onChange={(e) => setSettings({...settings, storeInfo: {...settings.storeInfo, name: e.target.value}})} />
          <InputGroup label="Store Email" type="email" value={settings.storeInfo.email} onChange={(e) => setSettings({...settings, storeInfo: {...settings.storeInfo, email: e.target.value}})} />
          <InputGroup label="Phone Number" value={settings.storeInfo.phone} onChange={(e) => setSettings({...settings, storeInfo: {...settings.storeInfo, phone: e.target.value}})} />
          <InputGroup label="GST Number" value={settings.storeInfo.gst} onChange={(e) => setSettings({...settings, storeInfo: {...settings.storeInfo, gst: e.target.value}})} />
          <div className="md:col-span-2">
            <InputGroup label="Store Address" value={settings.storeInfo.address} onChange={(e) => setSettings({...settings, storeInfo: {...settings.storeInfo, address: e.target.value}})} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Store Logo</label>
            <div className="flex items-center gap-8">
              <div className="relative group w-24 h-24">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-primary overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                  {settings.storeInfo.logo ? (
                    <img src={getImageUrl(settings.storeInfo.logo)} className="w-full h-full object-cover" />
                  ) : (
                    <Store size={32} className="text-slate-300" />
                  )}
                  {uploadingField === 'storeInfo.logo' && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 size={24} className="text-primary animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <div className="relative group max-w-xs">
                  <input 
                    type="file" 
                    id="logo-upload"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'storeInfo', 'logo')}
                    accept="image/*"
                  />
                  <label 
                    htmlFor="logo-upload"
                    className="flex items-center justify-center gap-3 w-full bg-slate-100 border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 rounded-2xl px-6 py-3 cursor-pointer transition-all"
                  >
                    <Upload size={18} className="text-slate-400 group-hover:text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-primary">
                      {settings.storeInfo.logo ? 'Change Logo' : 'Upload Logo'}
                    </span>
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PNG or SVG recommended</p>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* 2. Delivery Settings */}
        <SettingsCard title="Delivery Settings" icon={<Truck size={24} />} delay={0.2}>
          <InputGroup label="Delivery Charge ($)" type="number" value={settings.delivery.charge} onChange={(e) => setSettings({...settings, delivery: {...settings.delivery, charge: e.target.value}})} />
          <InputGroup label="Free Delivery Limit ($)" type="number" value={settings.delivery.freeLimit} onChange={(e) => setSettings({...settings, delivery: {...settings.delivery, freeLimit: e.target.value}})} />
          <InputGroup label="Delivery Radius (km)" type="number" value={settings.delivery.radius} onChange={(e) => setSettings({...settings, delivery: {...settings.delivery, radius: e.target.value}})} />
          <InputGroup label="Estimated Time" value={settings.delivery.time} onChange={(e) => setSettings({...settings, delivery: {...settings.delivery, time: e.target.value}})} />
        </SettingsCard>

        {/* 3. Payment & 4. Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SettingsCard title="Payment Settings" icon={<CreditCard size={24} />} delay={0.3}>
            <div className="md:col-span-2 flex flex-col gap-4">
              <Toggle label="Cash on Delivery" enabled={settings.payments.cod} onToggle={() => setSettings({...settings, payments: {...settings.payments, cod: !settings.payments.cod}})} />
              <Toggle label="Razorpay Payments" enabled={settings.payments.razorpay} onToggle={() => setSettings({...settings, payments: {...settings.payments, razorpay: !settings.payments.razorpay}})} />
              <Toggle label="UPI Payments" enabled={settings.payments.upi} onToggle={() => setSettings({...settings, payments: {...settings.payments, upi: !settings.payments.upi}})} />
            </div>
          </SettingsCard>

          <SettingsCard title="Notifications" icon={<Bell size={24} />} delay={0.4}>
            <div className="md:col-span-2 flex flex-col gap-4">
              <Toggle label="Email Notifications" enabled={settings.notifications.email} onToggle={() => setSettings({...settings, notifications: {...settings.notifications, email: !settings.notifications.email}})} />
              <Toggle label="WhatsApp Notifications" enabled={settings.notifications.whatsapp} onToggle={() => setSettings({...settings, notifications: {...settings.notifications, whatsapp: !settings.notifications.whatsapp}})} />
              <Toggle label="Order Alerts" enabled={settings.notifications.alerts} onToggle={() => setSettings({...settings, notifications: {...settings.notifications, alerts: !settings.notifications.alerts}})} />
            </div>
          </SettingsCard>
        </div>

        {/* 5. Banner Management */}
        <SettingsCard title="Banner Management" icon={<ImageIcon size={24} />} delay={0.5}>
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Home Hero Banner</label>
            <div className="aspect-[21/9] w-full rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-2 overflow-hidden relative group shadow-sm">
              {settings.banners.home ? (
                <img src={getImageUrl(settings.banners.home)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <ImageIcon size={32} className="text-slate-200" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">No Banner Uploaded</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                 <div className="relative">
                   <input 
                     type="file" 
                     id="home-banner-upload"
                     className="hidden"
                     onChange={(e) => handleImageUpload(e, 'banners', 'home')}
                     accept="image/*"
                   />
                   <label 
                     htmlFor="home-banner-upload"
                     className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-primary hover:text-white transition-all shadow-2xl"
                   >
                     Replace Banner
                   </label>
                 </div>
              </div>
              {uploadingField === 'banners.home' && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 size={32} className="text-primary animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Promotion Banner</label>
            <div className="aspect-[21/9] w-full rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-2 overflow-hidden relative group shadow-sm">
              {settings.banners.offer ? (
                <img src={getImageUrl(settings.banners.offer)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <ImageIcon size={32} className="text-slate-200" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">No Banner Uploaded</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                 <div className="relative">
                   <input 
                     type="file" 
                     id="offer-banner-upload"
                     className="hidden"
                     onChange={(e) => handleImageUpload(e, 'banners', 'offer')}
                     accept="image/*"
                   />
                   <label 
                     htmlFor="offer-banner-upload"
                     className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-primary hover:text-white transition-all shadow-2xl"
                   >
                     Replace Banner
                   </label>
                 </div>
              </div>
              {uploadingField === 'banners.offer' && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 size={32} className="text-primary animate-spin" />
                </div>
              )}
            </div>
          </div>
        </SettingsCard>

        {/* 6. Theme & 7. SEO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SettingsCard title="Theme Settings" icon={<Palette size={24} />} delay={0.6}>
            <div className="md:col-span-2 flex flex-col gap-6">
              <Toggle label="Dark Mode" enabled={settings.theme.darkMode} onToggle={() => setSettings({...settings, theme: {...settings.theme, darkMode: !settings.theme.darkMode}})} />
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Primary Color</label>
                <div className="flex gap-4">
                  {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                    <button 
                      key={color}
                      onClick={() => setSettings({...settings, theme: {...settings.theme, primaryColor: color}})}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${settings.theme.primaryColor === color ? 'border-slate-400 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title="SEO Settings" icon={<Search size={24} />} delay={0.7}>
            <div className="md:col-span-2 flex flex-col gap-5">
              <InputGroup label="Meta Title" value={settings.seo.title} onChange={(e) => setSettings({...settings, seo: {...settings.seo, title: e.target.value}})} icon={<Globe size={18} />} />
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meta Description</label>
                <textarea 
                  value={settings.seo.description}
                  onChange={(e) => setSettings({...settings, seo: {...settings.seo, description: e.target.value}})}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-primary/50 focus:bg-white transition-all text-sm h-24 resize-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </SettingsCard>
        </div>

      </div>

      {/* Sticky Save Button (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 md:hidden z-40 shadow-up-xl">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-black py-4 rounded-2xl shadow-[0_-4px_20px_rgba(16,185,129,0.1)] disabled:opacity-50"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
