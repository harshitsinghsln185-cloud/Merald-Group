import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  Lock,
  Mail,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Power,
  RefreshCw,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Admin } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import apiClient from '../../services/api';

import { LocationFields } from '../../components/common/LocationFields';
import { useLocationData } from '../../hooks/useLocationData';

const createAdminSchema = z
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

type CreateAdminFormData = z.infer<typeof createAdminSchema>;

interface AdminManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdmin: Admin | null;
  onSuccess: (msg: string) => void;
}

export const AdminManagementModal: React.FC<AdminManagementModalProps> = ({
  isOpen,
  onClose,
  currentAdmin,
  onSuccess,
}) => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customCity, setCustomCity] = useState('');

  const locationHook = useLocationData({
    country: 'United Arab Emirates',
    city: 'Dubai',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: '',
      email: '',
      officeAddress: 'Merald Tower, Downtown Dubai',
      password: '',
      confirmPassword: '',
    },
  });

  const fetchAdmins = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiClient.get('/admins');
      if (res.data && res.data.success) {
        setAdmins(res.data.data || []);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to fetch admin list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShowCreateForm(false);
      fetchAdmins();
    }
  }, [isOpen]);

  const handleCreateSubmit = async (data: CreateAdminFormData) => {
    setErrorMsg('');
    try {
      const { confirmPassword, ...payload } = data;
      const finalPayload = {
        ...payload,
        country: locationHook.selectedCountry?.name || 'United Arab Emirates',
        state: locationHook.selectedState?.name || '',
        city: locationHook.selectedCity?.name || customCity || 'Dubai',
        phone: locationHook.fullPhone,
      };

      const res = await apiClient.post('/admins', finalPayload);
      if (res.data && res.data.success) {
        onSuccess('New Administrator account created successfully!');
        setShowCreateForm(false);
        reset();
        fetchAdmins();
      } else {
        throw new Error(res.data?.message || 'Failed to create admin');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error creating admin account');
    }
  };

  const handleToggleStatus = async (adminObj: any) => {
    const newStatus = adminObj.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED';

    const activeCount = admins.filter((a) => a.status === 'ACTIVE').length;
    if (adminObj.status === 'ACTIVE' && activeCount <= 1) {
      alert('Cannot disable the last remaining active administrator account.');
      return;
    }

    try {
      const res = await apiClient.put(`/admins/${adminObj._id || adminObj.id}`, { status: newStatus });
      if (res.data && res.data.success) {
        onSuccess(`Admin ${adminObj.name} status set to ${newStatus}`);
        fetchAdmins();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error updating admin status');
    }
  };

  const handleDelete = async (adminObj: any) => {
    const activeCount = admins.filter((a) => a.status === 'ACTIVE').length;
    if (activeCount <= 1) {
      alert('Cannot remove the last remaining active administrator account.');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently remove admin ${adminObj.name}?`)) {
      try {
        const res = await apiClient.delete(`/admins/${adminObj._id || adminObj.id}`);
        if (res.data && res.data.success) {
          onSuccess(`Admin account ${adminObj.name} removed successfully.`);
          fetchAdmins();
        }
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || err.message || 'Failed to remove admin account');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Executive Admin Management"
      icon={<ShieldCheck className="w-5 h-5" />}
      maxWidth="max-w-4xl"
    >
      {errorMsg && (
        <div className="p-3.5 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {showCreateForm ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" /> Create Secondary Administrator Account
            </h4>
            <Button onClick={() => setShowCreateForm(false)} variant="secondary" size="sm">
              Back to Admin List
            </Button>
          </div>

          <form onSubmit={handleSubmit(handleCreateSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Marcus Vance"
                icon={<User className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Corporate Email *"
                type="email"
                placeholder="e.g. marcus@meraldgroup.com"
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
                phoneLabel="Admin Contact Phone Number"
              />
            </div>

            <Input
              label="Office Address *"
              placeholder="e.g. Abu Dhabi Commercial Hub, Level 12"
              icon={<MapPin className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              error={errors.officeAddress?.message}
              {...register('officeAddress')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password *"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password *"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <div className="pt-4 border-t border-white/8 flex items-center justify-end gap-3">
              <Button type="button" onClick={() => setShowCreateForm(false)} variant="secondary" size="md">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="primary" size="md">
                {isSubmitting ? 'Creating Admin Account...' : 'Create Admin Account'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/8">
            <div>
              <h4 className="text-base font-extrabold text-white">Registered System Administrators</h4>
              <p className="text-xs text-slate-400">Only authorized admins can manage executive user access.</p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={fetchAdmins} variant="secondary" size="sm">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
              <Button onClick={() => setShowCreateForm(true)} variant="primary" size="sm">
                <UserPlus className="w-4 h-4" /> Add Admin Account
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading administrators list...</div>
          ) : (
            <div className="enterprise-table-container max-h-96 overflow-y-auto">
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Admin Name</th>
                    <th>Email Address</th>
                    <th>Location</th>
                    <th>Office Address</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a, idx) => {
                    const isSelf = currentAdmin && (currentAdmin.id === a._id || currentAdmin.id === a.id);
                    const isDisabled = a.status === 'DISABLED';
                    return (
                      <tr key={idx} className={isDisabled ? 'opacity-60 bg-rose-500/5' : ''}>
                        <td className="font-bold text-white text-xs">
                          {a.name}{' '}
                          {isSelf && (
                            <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              (YOU)
                            </span>
                          )}
                        </td>
                        <td className="font-mono text-slate-300 text-xs">{a.email}</td>
                        <td className="text-slate-300 text-xs">
                          {a.city}, {a.country}
                        </td>
                        <td className="text-slate-400 text-xs max-w-[160px] truncate" title={a.officeAddress}>
                          {a.officeAddress}
                        </td>
                        <td>
                          {isDisabled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <AlertCircle className="w-3 h-3" /> DISABLED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> ACTIVE
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(a)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isDisabled
                                  ? 'bg-emerald-500/12 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/12 hover:bg-amber-500/25 text-amber-400 border-amber-500/30'
                              }`}
                              title={isDisabled ? 'Enable Admin Account' : 'Disable Admin Account'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDelete(a)}
                              className="p-1.5 rounded-lg bg-rose-500/12 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                              title="Delete Admin Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-4 border-t border-white/8 flex items-center justify-end">
            <Button onClick={onClose} variant="secondary" size="md">
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
