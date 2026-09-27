import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  size = 'sm',
  dot = false,
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-amber-950/60 text-amber-300 border-amber-800/60 shadow-2xs',
    secondary: 'bg-stone-800/80 text-stone-300 border-stone-700/80',
    cyan: 'bg-amber-950/60 text-amber-300 border-amber-800/60 shadow-2xs',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-800/60 shadow-2xs',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 shadow-2xs',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-800/60 shadow-2xs',
    purple: 'bg-orange-950/60 text-orange-300 border-orange-800/60 shadow-2xs',
    outline: 'bg-transparent text-stone-300 border-stone-700'
  };

  const dotColors = {
    primary: 'bg-amber-400',
    secondary: 'bg-stone-400',
    cyan: 'bg-amber-400',
    amber: 'bg-amber-400',
    emerald: 'bg-emerald-400',
    rose: 'bg-rose-400',
    purple: 'bg-orange-400',
    outline: 'bg-stone-500'
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[11px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1 text-xs sm:text-sm gap-1.5'
  };

  return (
    <span
      className={`inline-flex items-center font-bold tracking-tight rounded-full border transition-all duration-150 select-none ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColors[variant] || dotColors.primary
          } animate-pulse`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
