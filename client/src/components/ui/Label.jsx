import React from 'react';

export const Label = ({
  children,
  required = false,
  optional = false,
  className = '',
  htmlFor,
  ...props
}) => (
  <label
    htmlFor={htmlFor}
    className={`block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center justify-between ${className}`}
    {...props}
  >
    <span className="flex items-center gap-1">
      {children}
      {required && <span className="text-amber-500 font-bold" title="Required field">*</span>}
    </span>
    {optional && (
      <span className="text-stone-500 font-medium normal-case text-2xs tracking-normal">
        Optional
      </span>
    )}
  </label>
);

export default Label;
