import React from 'react';

const Logo = ({ size = 40, showText = true, textLight = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo.svg"
        alt="FreshCart Logo"
        width={size}
        height={size}
        className="rounded-2xl shadow-sm"
        style={{ minWidth: size }}
      />
      {showText && (
        <span
          className={`font-black tracking-tighter text-2xl leading-none ${
            textLight ? 'text-white' : 'text-slate-900'
          }`}
        >
          Fresh<span className="text-primary">Cart</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
