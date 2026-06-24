import React from 'react';

const Logo = ({ size = 44, showText = true, showBadge = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img
        src="/logo.svg"
        alt="FreshCart Logo"
        width={size}
        height={size}
        className="rounded-2xl shadow-lg"
        style={{ minWidth: size }}
      />
      {showText && (
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Fresh<span className="text-primary">Cart</span>
          </h1>
          {showBadge && (
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
              Admin Elite
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
