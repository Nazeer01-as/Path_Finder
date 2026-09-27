import React from 'react';

export const Card = ({ children, className = '', hover = true, glass = false, ...props }) => {
  const surfaceClass = glass
    ? 'glass-card'
    : 'bg-stone-900/80 border border-stone-800 text-stone-100 shadow-xs';
  const hoverClass = hover
    ? 'hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-300'
    : '';

  return (
    <div
      className={`rounded-2xl relative ${surfaceClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-bold text-white tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-stone-400 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-3 border-t border-stone-800 flex items-center ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
