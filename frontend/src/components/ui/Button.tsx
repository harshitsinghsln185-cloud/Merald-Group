import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-[0_10px_25px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(16,185,129,0.45)] hover:-translate-y-0.5',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 border border-white/10 hover:border-white/20 shadow-sm',
    danger:
      'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 hover:border-rose-500',
    ghost:
      'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/8',
  };

  const sizes = {
    sm: 'text-xs px-3 py-2 min-h-[36px] gap-1.5',
    md: 'text-xs px-4 py-2.5 min-h-[42px] gap-2',
    lg: 'text-sm px-5 py-3 min-h-[48px] gap-2.5',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
