import React, { useState, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Save, Upload,
  Loader2, CheckCircle2, AlertCircle, Camera, Shield, Eye, EyeOff
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { uploadImage } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const InputGroup = ({ label, type = 'text', value, onChange, icon, placeholder, disabled }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 ${icon ? 'pl-12' : 'px-4'} pr-4 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:border-primary/50 focus:bg-white transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed`}
      />
    </div>
  </div>
);

const PasswordInput = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
          <Lock size={18} />
        </div>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:border-primary/50 focus:bg-white transition-all placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const Toast = ({ show, message, type }) => (
  show ? (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl border flex items-center gap-3 shadow-2xl backdrop-blur-xl ${
        type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
          : 'bg-red-500/10 border-red-500/20 text-red-500'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span className="font-bold text-sm">{message}</span>
    </motion.div>
  ) : null
);

const Profile = () => {
  const { adminInfo, updateProfile } = useContext(AuthContext);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: adminInfo?.name || '',
    email: adminInfo?.email || '',
    mobile: adminInfo?.mobile || '',
    phone: adminInfo?.phone || '',
    bio: adminInfo?.bio || '',
    avatar: adminInfo?.avatar || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await uploadImage(formData);
      setForm(f => ({ ...f, avatar: data.image }));
      showToast('Profile photo updated!');
    } catch {
      showToast('Failed to upload photo', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = { ...form };

      if (passwords.newPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          showToast('New passwords do not match', 'error');
          setSaving(false);
          return;
        }
        if (!passwords.currentPassword) {
          showToast('Enter your current password', 'error');
          setSaving(false);
          return;
        }
        payload.currentPassword = passwords.currentPassword;
        payload.newPassword = passwords.newPassword;
      }

      const result = await updateProfile(payload);
      if (result?.success === false) {
        showToast(result.message || 'Update failed', 'error');
      } else {
        showToast('Profile updated successfully!');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = form.avatar ? getImageUrl(form.avatar) : null;
  const initials = form.name?.charAt(0)?.toUpperCase() || 'A';

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-4xl mx-auto">
      <Toast {...toast} />

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your admin account details and security.</p>
      </div>

      {/* Avatar + Basic Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2.5rem] p-8 md:p-10"
      >
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100 dark:border-white/5">
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-[1.5rem] overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-primary">{initials}</span>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-[1.5rem]">
                  <Loader2 size={28} className="text-white animate-spin" />
                </div>
              )}
            </div>
            {/* Camera button */}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-emerald-600 transition-all"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{adminInfo?.name}</h2>
            <p className="text-sm text-slate-400 mt-1">{adminInfo?.email}</p>
            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                <Shield size={12} />
                Admin Elite
              </div>
            </div>
          </div>

          <button
            onClick={() => fileRef.current?.click()}
            className="sm:ml-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-primary/40 hover:text-primary transition-all text-sm font-black"
          >
            <Upload size={16} />
            Change Photo
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup
            label="Full Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            icon={<User size={18} />}
            placeholder="Your full name"
          />
          <InputGroup
            label="Email Address"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            icon={<Mail size={18} />}
            placeholder="admin@email.com"
          />
          <InputGroup
            label="Mobile Number"
            value={form.mobile}
            onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
            icon={<Phone size={18} />}
            placeholder="+91 98765 43210"
          />
          <InputGroup
            label="Phone (alternate)"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            icon={<Phone size={18} />}
            placeholder="Optional"
          />
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="A short bio about yourself..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl py-3 px-4 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary/50 focus:bg-white transition-all resize-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </motion.div>

      {/* Password Change Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[2.5rem] p-8 md:p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Change Password</h2>
            <p className="text-xs text-slate-400 mt-0.5">Leave blank to keep current password</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PasswordInput
            label="Current Password"
            value={passwords.currentPassword}
            onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
            placeholder="••••••••"
          />
          <PasswordInput
            label="New Password"
            value={passwords.newPassword}
            onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
            placeholder="••••••••"
          />
          <PasswordInput
            label="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
            placeholder="••••••••"
          />
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="flex items-center gap-3 bg-primary hover:bg-emerald-500 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 text-sm uppercase tracking-widest"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Save Profile
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
