import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative group flex items-center">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors z-20 pointer-events-none flex items-center justify-center w-5 h-5 shrink-0">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`glass-input text-sm text-slate-100 placeholder:text-slate-500 bg-[#091424]/90 border border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all duration-200 ${
              icon ? '!pl-11' : '!pl-4'
            } ${rightElement ? '!pr-11' : '!pr-4'} ${
              error ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : ''
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 z-20 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-[11px] font-semibold text-rose-400 mt-1 flex items-center gap-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
