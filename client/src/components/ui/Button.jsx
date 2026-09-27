import React from 'react';

const Button = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none';

  const variantStyles = {
    default: 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20',
    gradient: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 font-bold hover:opacity-95 shadow-md shadow-amber-500/25',
    secondary: 'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700',
    outline: 'border border-stone-700 bg-stone-900/80 hover:bg-stone-800 text-stone-200 hover:border-stone-600 shadow-2xs',
    ghost: 'text-stone-400 hover:text-white hover:bg-stone-800/60',
    link: 'text-amber-400 hover:text-amber-300 underline-offset-4 hover:underline p-0 h-auto',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-500/20',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/20'
  };

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs gap-1 rounded-lg',
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4 py-2 text-sm gap-2 rounded-xl',
    lg: 'px-6 py-3 text-base gap-2.5 rounded-2xl',
    icon: 'p-2 rounded-xl'
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
