import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Building2,
  Mail,
  Lock,
  User,
  MapPin,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LocationFields } from '../../components/common/LocationFields';
import { useLocationData } from '../../hooks/useLocationData';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name is required (min 2 characters)'),
    email: z.string().email('Enter a valid corporate email address'),
    officeAddress: z.string().min(5, 'Office address is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password must match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegisterSubmit: (data: any) => Promise<any>;
  onBackToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSubmit,
  onBackToLogin,
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customCity, setCustomCity] = useState('');

  const locationHook = useLocationData({
    country: 'United Arab Emirates',
    city: 'Dubai',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      officeAddress: 'Merald Tower, Level 24, Downtown Dubai',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg('');

    const countryName = locationHook.selectedCountry?.name || 'United Arab Emirates';
    const stateName = locationHook.selectedState?.name || '';
    const cityName = locationHook.selectedCity?.name || customCity || 'Dubai';

    if (!countryName) {
      setErrorMsg('Country location is required');
      return;
    }

    if (!cityName) {
      setErrorMsg('City location is required');
      return;
    }

    try {
      const { confirmPassword, ...payload } = data;
      const finalPayload = {
        ...payload,
        email: payload.email.toLowerCase().trim(),
        country: countryName,
        state: stateName,
        city: cityName,
        phone: locationHook.fullPhone,
      };

      const res = await onRegisterSubmit(finalPayload);
      if (res && (res.success !== false)) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res?.message || 'Admin registration failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating admin account');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-[#070F1E] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md animate-fade-in relative z-10">
          <div className="glass-card p-6 sm:p-8 border border-white/12 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white">Admin Account Created</h2>
              <p className="text-sm text-slate-300 mt-2 font-medium leading-relaxed">
                Admin account created successfully. You can now sign in.
              </p>
            </div>

            <Button
              onClick={onBackToLogin}
              className="w-full py-3.5 text-sm font-bold shadow-lg flex items-center justify-center gap-2"
            >
              Go to Admin Login <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#070F1E] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden py-12">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl animate-fade-in relative z-10">
        <button
          onClick={onBackToLogin}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Admin Sign In
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 mx-auto flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            MERALD<span className="text-emerald-400">GROUP</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Enterprise Admin Registration
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card p-6 sm:p-8 border border-white/12 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/8">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Create Administrator Account
            </h2>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Public Registration
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold leading-snug">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Alexander Wright"
                icon={<User className="w-4 h-4 text-emerald-400 shrink-0 opacity-100" strokeWidth={2} />}
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="e.g. alexander@meraldgroup.com"
                icon={<Mail className="w-4 h-4 text-emerald-400 shrink-0 opacity-100" strokeWidth={2} />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            {/* Location Fields (Country & City selector/input) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <LocationFields
                locationHook={locationHook}
                customCityValue={customCity}
                onCustomCityChange={setCustomCity}
                showPhoneInput={false}
              />
            </div>

            <Input
              label="Office Address *"
              placeholder="e.g. Merald Tower, Level 24, Downtown Dubai"
              icon={<MapPin className="w-4 h-4 text-emerald-400 shrink-0 opacity-100" strokeWidth={2} />}
              error={errors.officeAddress?.message}
              {...register('officeAddress')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Password *"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4 text-emerald-400 shrink-0 opacity-100" strokeWidth={2} />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-300 hover:text-emerald-400 focus:outline-none cursor-pointer p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <div>
                <Input
                  label="Confirm Password *"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4 text-emerald-400 shrink-0 opacity-100" strokeWidth={2} />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-sm font-bold mt-4 shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Admin Account...</span>
                </div>
              ) : (
                <>
                  Register Admin Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
