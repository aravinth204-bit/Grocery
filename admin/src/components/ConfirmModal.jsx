import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6">
        {/* Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div className="p-8 flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${
              type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'
            }`}>
              <AlertTriangle size={40} />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={onClose}
                className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-8 py-4 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg ${
                  type === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                    : 'bg-primary hover:bg-emerald-400 text-white shadow-primary/20'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors p-2"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
