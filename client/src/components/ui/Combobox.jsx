import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

export const Combobox = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select or type custom...',
  helperText,
  error,
  icon: Icon,
  className = '',
  disabled = false,
  success = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleSelect = (opt) => {
    setSearchTerm(opt);
    onChange(opt);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setSearchTerm(newVal);
    onChange(newVal);
    setIsOpen(true);
  };

  const isSelected = (opt) => (value || '').toLowerCase() === opt.toLowerCase();

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type="text"
          disabled={disabled}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full text-sm font-medium rounded-xl border bg-stone-900 transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'}
            pr-10 py-2.5 text-stone-100 placeholder:text-stone-500 disabled:bg-stone-950 disabled:text-stone-600
            ${error
              ? 'border-rose-500/80 bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : success
                ? 'border-emerald-500/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15'
                : 'border-stone-800 hover:border-stone-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15'
            }`}
        />
        <div className="absolute right-2.5 flex items-center gap-1">
          {success && !error && (
            <span className="text-emerald-500 mr-1 pointer-events-none">
              <Check className="w-3.5 h-3.5" />
            </span>
          )}
          {error && (
            <span className="text-rose-500 mr-1 pointer-events-none">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          )}
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-stone-400 hover:text-stone-200 rounded-md transition-colors cursor-pointer"
            aria-label="Toggle options list"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1.5 w-full bg-stone-900 rounded-xl border border-stone-800 shadow-2xl max-h-56 overflow-y-auto py-1 text-sm animate-in fade-in-50 zoom-in-95 duration-150">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const selected = isSelected(opt);
              return (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`px-3.5 py-2 cursor-pointer flex items-center justify-between text-xs font-medium transition-colors ${
                    selected
                      ? 'bg-amber-500/15 text-amber-300 font-bold'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-amber-400'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {selected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />}
                </div>
              );
            })
          ) : (
            <div className="px-3.5 py-2.5 text-xs text-stone-500 italic">
              No matching suggestions. You can keep typing custom entry.
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
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
};

export default Combobox;
