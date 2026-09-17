import React, { useEffect, useState } from 'react';
import { Building2, ShieldCheck, Sparkles } from 'lucide-react';

interface WelcomeLoadingScreenProps {
  onComplete: () => void;
}

export const WelcomeLoadingScreen: React.FC<WelcomeLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#070F1E] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-tr from-emerald-500/15 via-sky-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full animate-fade-in">
        {/* Animated Brand Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-[0_0_40px_rgba(16,185,129,0.35)] animate-bounce duration-1000">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0F1C2E] border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Corporate Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          MERALD<span className="text-emerald-400">GROUP</span>
        </h1>
        <p className="text-sm sm:text-base font-semibold text-slate-300 mt-2">
          Welcome to Merald Group
        </p>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-widest mt-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Employee Management System
        </div>

        {/* Smooth Progress Bar */}
        <div className="w-full bg-[#0F1C2E] border border-white/10 rounded-full h-2 mt-8 overflow-hidden p-0.5 relative shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-500 to-sky-400 h-full rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(16,185,129,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full mt-2 text-[11px] font-bold text-slate-400">
          <span>Loading Secure Environment...</span>
          <span className="text-emerald-400 font-mono">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
