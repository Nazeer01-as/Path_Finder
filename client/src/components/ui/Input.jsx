import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(({
  className = '',
  type = 'text',
  error,
  success,
  icon: Icon,
  helperText,
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={`w-full text-sm font-medium rounded-xl border bg-stone-900 transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${success || error ? 'pr-10' : 'pr-3.5'}
            py-2.5 text-stone-100 placeholder:text-stone-500 disabled:bg-stone-950 disabled:text-stone-600
            ${error
              ? 'border-rose-500/80 bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : success
                ? 'border-emerald-500/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15'
                : 'border-stone-800 hover:border-stone-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15'
            }
            ${className}`}
          {...props}
        />
        {success && !error && (
          <div className="absolute right-3 text-emerald-500 pointer-events-none">
            <Check className="w-4 h-4" />
          </div>
        )}
        {error && (
          <div className="absolute right-3 text-rose-500 pointer-events-none">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in-50 duration-150">
          <span>{error}</span>
        </p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-2xs text-slate-500 leading-normal">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
