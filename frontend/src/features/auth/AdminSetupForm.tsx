import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Building2,
  Lock,
  Mail,
  User,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LocationFields } from '../../components/common/LocationFields';
import { useLocationData } from '../../hooks/useLocationData';

const setupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid corporate email address'),
    officeAddress: z.string().min(5, 'Office address is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SetupFormData = z.infer<typeof setupSchema>;

interface AdminSetupFormProps {
  onSetupSubmit: (data: any) => Promise<any>;
}

export const AdminSetupForm: React.FC<AdminSetupFormProps> = ({ onSetupSubmit }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customCity, setCustomCity] = useState('');

  const locationHook = useLocationData({
    country: 'United Arab Emirates',
    city: 'Dubai',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      name: '',
      email: '',
      officeAddress: 'Merald Tower, Downtown Dubai',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SetupFormData) => {
    setErrorMsg('');

    const countryName = locationHook.selectedCountry?.name || 'United Arab Emirates';
    const stateName = locationHook.selectedState?.name || '';
    const cityName = locationHook.selectedCity?.name || customCity || 'Dubai';

    if (!countryName) {
      setErrorMsg('Please select a country');
      return;
    }

    try {
      const { confirmPassword, ...payload } = data;
      const finalPayload = {
        ...payload,
        country: countryName,
        state: stateName,
        city: cityName,
        phone: locationHook.fullPhone,
      };

      const res = await onSetupSubmit(finalPayload);
      if (!res.success) {
        setErrorMsg(res.message || 'Setup registration failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete initial admin setup');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070F1E] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none py-12">
      {/* Radial Background Lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl animate-fade-in relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 mx-auto flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            MERALD<span className="text-emerald-400">GROUP</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Enterprise System Setup Mode
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card p-6 sm:p-8 border border-white/12 shadow-2xl space-y-6">
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-sky-500/10 border border-emerald-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-extrabold text-white">First Executive Admin Setup</h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Zero admin accounts exist in the database. Register the primary Executive Administrator below. Public registration will be disabled immediately after setup.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Alexander Wright"
                icon={<User className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Corporate Email *"
                type="email"
                placeholder="e.g. alexander@meraldgroup.com"
                icon={<Mail className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            {/* Cascading Location & Phone Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <LocationFields
                locationHook={locationHook}
                customCityValue={customCity}
                onCustomCityChange={setCustomCity}
                phoneLabel="HQ Contact Phone Number"
              />
            </div>

            <Input
              label="HQ Office Address *"
              placeholder="e.g. Merald Tower, Level 24, Downtown Dubai"
              icon={<MapPin className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              error={errors.officeAddress?.message}
              {...register('officeAddress')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Password *"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-300 hover:text-emerald-400 focus:outline-none cursor-pointer"
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
                  icon={<Lock className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
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
                  <span>Creating Executive Admin...</span>
                </div>
              ) : (
                <>
                  Complete Setup & Launch Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
