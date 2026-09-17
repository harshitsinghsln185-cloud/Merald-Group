import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Lock, User, Globe, MapPin, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  officeAddress: z.string().min(5, 'Office address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegisterSubmit: (data: RegisterFormData) => Promise<any>;
  onBackToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSubmit,
  onBackToLogin,
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      country: 'United Arab Emirates',
      city: 'Dubai',
      officeAddress: 'Merald Tower, Level 24, Financial Center Road',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg('');
    try {
      const res = await onRegisterSubmit(data);
      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating admin account');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070F1E] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg animate-fade-in relative z-10">
        <button
          onClick={onBackToLogin}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 mb-4 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Admin Sign In
        </button>

        <div className="glass-card p-6 sm:p-8 border border-white/12 shadow-2xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/8 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white font-bold shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name *"
              placeholder="e.g. Executive Director"
              icon={<User className="w-4 h-4 text-slate-400" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address *"
              type="email"
              placeholder="admin@meraldgroup.com"
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Country *"
                placeholder="Country"
                icon={<Globe className="w-4 h-4 text-slate-400" />}
                error={errors.country?.message}
                {...register('country')}
              />

              <Input
                label="City *"
                placeholder="City"
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
                error={errors.city?.message}
                {...register('city')}
              />
            </div>

            <Input
              label="Office Address *"
              placeholder="Full office address"
              error={errors.officeAddress?.message}
              {...register('officeAddress')}
            />

            <Input
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-sm font-bold mt-4 shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Encrypted Admin Account...</span>
                </div>
              ) : (
                'Register & Log In Admin'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
