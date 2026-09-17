import React, { useState } from 'react';
import { Building2, Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { authService } from '../../services/auth.service';
import type { Admin } from '../../types';

interface AdminLoginFormProps {
  onLoginSuccess: (admin: Admin) => void;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onLoginSuccess,
  onOpenRegister,
  onOpenForgotPassword,
}) => {
  const [email, setEmail] = useState('admin@meraldgroup.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);
      const res = await authService.login({ email, password });
      if (res.success && res.data?.admin) {
        onLoginSuccess(res.data.admin);
      } else {
        setErrorMsg(res.message || 'Login failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@meraldgroup.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen w-full bg-[#070F1E] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#0EA5E9] mx-auto flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            MERALD<span className="text-[#10B981]">GROUP</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Enterprise HR & Payroll Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 border border-[rgba(255,255,255,0.12)]">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)] mb-6">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Admin Sign In
            </h2>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase">
              JWT Secured
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Quick Demo Fill Shortcut */}
          <div className="p-3 mb-6 rounded-xl bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Default Admin Demo:</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              Fill Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@meraldgroup.com"
                  required
                  className="glass-input pl-10"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="glass-input pl-10"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full py-3 text-sm font-bold rounded-xl mt-4"
            >
              {loading ? (
                'Authenticating Session...'
              ) : (
                <>
                  Access Admin Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Create New Admin Link */}
          <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] text-center">
            <p className="text-xs text-slate-400">
              Need a new enterprise admin account?{' '}
              <button
                onClick={onOpenRegister}
                className="text-emerald-400 font-bold hover:underline"
              >
                Register Admin Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
