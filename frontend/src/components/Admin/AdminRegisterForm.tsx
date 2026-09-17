import React, { useState } from 'react';
import { Building2, Mail, Lock, User, Globe, MapPin, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/auth.service';
import type { Admin } from '../../types';

interface AdminRegisterFormProps {
  onRegisterSuccess: (admin: Admin) => void;
  onBackToLogin: () => void;
}

export const AdminRegisterForm: React.FC<AdminRegisterFormProps> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'United Arab Emirates',
    city: 'Dubai',
    officeAddress: 'Merald Tower, Level 24, Financial Center Road',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Please complete all required registration fields');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.register(formData);
      if (res.success && res.data?.admin) {
        onRegisterSuccess(res.data.admin);
      } else {
        setErrorMsg(res.message || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating admin account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070F1E] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg animate-fade-in relative z-10">
        <button
          onClick={onBackToLogin}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 mb-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Admin Sign In
        </button>

        <div className="glass-card p-8 border border-[rgba(255,255,255,0.12)]">
          <div className="flex items-center gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)] mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#0EA5E9] flex items-center justify-center text-white font-bold shadow-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Create Admin Account</h2>
              <p className="text-xs text-slate-400">
                Register authorized administrator for Merald Group
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Executive Director"
                  required
                  className="glass-input pl-10"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@meraldgroup.com"
                  required
                  className="glass-input pl-10"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Country <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="glass-input pl-10"
                  />
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  City <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="glass-input pl-10"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Office Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
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
              {loading ? 'Creating Encrypted Admin Account...' : 'Register & Log In Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
