import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Enter a valid corporate email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSubmit: (data: LoginFormData) => Promise<any>;
  onOpenForgotPassword: () => void;
  onOpenRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSubmit,
  onOpenForgotPassword,
  onOpenRegister,
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg('');
    try {
      const res = await onLoginSubmit(data);
      if (!res.success) {
        setErrorMsg(res.message || 'Authentication failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email address or password');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070F1E] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background Radial Lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 mx-auto flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            MERALD<span className="text-emerald-400">GROUP</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Enterprise HR & Payroll Portal
          </p>
        </div>

        {/* Login Form Container */}
        <div className="glass-card p-6 sm:p-8 border border-white/12 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Admin Sign In
            </h2>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              JWT Secured
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold leading-snug">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input with Visible Icon */}
            <Input
              label="Admin Email Address"
              type="email"
              placeholder="e.g. alexander@meraldgroup.com"
              icon={<Mail className="w-4 h-4 text-emerald-400 shrink-0 opacity-100" strokeWidth={2} />}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password Input with Visible Icon & Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </span>
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-emerald-400 shrink-0 opacity-100" strokeWidth={2} />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-300 hover:text-emerald-400 focus:outline-none cursor-pointer p-1 rounded-md transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                    ) : (
                      <Eye className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-sm font-bold mt-4 shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Session...</span>
                </div>
              ) : (
                <>
                  Access Admin Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Public Admin Registration Link */}
          {onOpenRegister && (
            <div className="mt-6 pt-4 border-t border-white/8 text-center">
              <p className="text-xs text-slate-400 font-medium">
                Need an administrator account?{' '}
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer ml-1 inline-flex items-center gap-1 transition-colors"
                >
                  Create Admin <UserPlus className="w-3.5 h-3.5" />
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
