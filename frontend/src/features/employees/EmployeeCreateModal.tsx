import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sparkles,
  UserPlus,
  User,
  CreditCard,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  Hash,
  Link as LinkIcon,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Employee } from '../../types';

const employeeCreateSchema = z.object({
  name: z.string().min(2, 'Employee Name must be at least 2 characters'),
  passportNumber: z.string().min(3, 'Passport Number is required'),
  designation: z.string().min(2, 'Designation is required'),
  site: z.string().min(2, 'Site Location is required'),
  basicSalary: z.coerce.number().min(0, 'Basic Salary must be positive'),
  payableSalary: z.coerce.number().min(0, 'Payable Salary must be positive'),
  payableMonth: z.string().min(3, 'Month of Payable Salary is required'),
  accountNumber: z.string().min(5, 'Account Number is required'),
  ifscCode: z.string().min(3, 'IFSC / SWIFT Code is required'),
  paymentSlip: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'LEAVE']),
});

type EmployeeCreateFormData = z.infer<typeof employeeCreateSchema>;

interface EmployeeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: Partial<Employee>) => Promise<void>;
  totalCount: number;
}

import { LocationFields } from '../../components/common/LocationFields';
import { useLocationData } from '../../hooks/useLocationData';

export const EmployeeCreateModal: React.FC<EmployeeCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  totalCount,
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedIds, setGeneratedIds] = useState({ empId: '', empCode: '' });
  const [customCity, setCustomCity] = useState('');

  const locationHook = useLocationData({
    country: 'United Arab Emirates',
    city: 'Dubai',
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeCreateFormData>({
    resolver: zodResolver(employeeCreateSchema),
    defaultValues: {
      name: '',
      passportNumber: '',
      designation: '',
      site: '',
      basicSalary: 18500,
      payableSalary: 18500,
      payableMonth: 'September 2026',
      accountNumber: '',
      ifscCode: '',
      paymentSlip: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (isOpen) {
      const nextId = `EMP-${1000 + totalCount + 1}`;
      const nextCode = `MGD-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedIds({ empId: nextId, empCode: nextCode });
      reset({
        name: '',
        passportNumber: '',
        designation: '',
        site: '',
        basicSalary: 18500,
        payableSalary: 18500,
        payableMonth: 'September 2026',
        accountNumber: '',
        ifscCode: '',
        paymentSlip: '',
        status: 'ACTIVE',
      });
      setErrorMsg('');
    }
  }, [isOpen, totalCount, reset]);

  const onFormSubmit = async (data: EmployeeCreateFormData) => {
    setErrorMsg('');
    try {
      await onSubmit({
        ...data,
        employeeId: generatedIds.empId,
        employeeCode: generatedIds.empCode,
        country: locationHook.selectedCountry?.name || 'United Arab Emirates',
        state: locationHook.selectedState?.name || '',
        city: locationHook.selectedCity?.name || customCity || 'Dubai',
        phone: locationHook.fullPhone,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create employee record');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard & Create Employee Record"
      icon={<UserPlus className="w-5 h-5 text-white" />}
      maxWidth="max-w-5xl lg:max-w-6xl w-full sm:w-[90vw]"
    >
      <div className="space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto pr-1">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Auto Generated Identifiers Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-sky-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200 font-bold">Auto Generated System Identifiers:</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-extrabold">
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30">
              ID: {generatedIds.empId}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              CODE: {generatedIds.empCode}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Responsive 2-Column Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Row 1: Employee Name | Passport Number */}
            <Input
              label="Employee Full Name *"
              placeholder="e.g. Sarah Al-Mansoor"
              icon={<User className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Passport Number *"
              placeholder="e.g. N9824152A"
              icon={<CreditCard className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              className="uppercase font-mono tracking-wider"
              error={errors.passportNumber?.message}
              {...register('passportNumber')}
            />

            {/* Row 2: Designation | Site Location */}
            <Input
              label="Designation / Position *"
              placeholder="e.g. Senior Project Engineer"
              icon={<Briefcase className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              error={errors.designation?.message}
              {...register('designation')}
            />

            <Input
              label="Site Location / Project *"
              placeholder="e.g. Dubai South Megastructure"
              icon={<MapPin className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              error={errors.site?.message}
              {...register('site')}
            />

            {/* Location & Contact Fields */}
            <LocationFields
              locationHook={locationHook}
              customCityValue={customCity}
              onCustomCityChange={setCustomCity}
              phoneLabel="Employee Contact Phone Number"
            />

            {/* Row 3: Basic Salary | Payable Salary */}
            <Input
              label="Basic Salary ($) *"
              type="number"
              placeholder="18500"
              icon={<DollarSign className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              error={errors.basicSalary?.message}
              {...register('basicSalary', {
                onChange: (e) => setValue('payableSalary', Number(e.target.value)),
              })}
            />

            <Input
              label="Payable Salary ($) *"
              type="number"
              placeholder="18500"
              icon={<DollarSign className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              error={errors.payableSalary?.message}
              {...register('payableSalary')}
            />

            {/* Row 4: Payable Month | Employee Status */}
            <Input
              label="Month of Payable Salary *"
              placeholder="e.g. September 2026"
              icon={<Calendar className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              error={errors.payableMonth?.message}
              {...register('payableMonth')}
            />

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Employee Status *
              </label>
              <select
                {...register('status')}
                className="glass-input bg-[#091424] cursor-pointer text-sm font-semibold rounded-xl"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="LEAVE">ON LEAVE</option>
              </select>
            </div>

            {/* Row 5: Account Number | IFSC Code */}
            <Input
              label="Bank Account Number *"
              placeholder="e.g. AE480330000001294857102"
              icon={<Building className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              className="font-mono text-xs sm:text-sm"
              error={errors.accountNumber?.message}
              {...register('accountNumber')}
            />

            <Input
              label="IFSC / SWIFT Code *"
              placeholder="e.g. EBILAE2DXXX"
              icon={<Hash className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
              className="font-mono uppercase text-xs sm:text-sm"
              error={errors.ifscCode?.message}
              {...register('ifscCode')}
            />
          </div>

          {/* Full Width: Payment Slip Attachment URL */}
          <Input
            label="Payment Slip (Attachment Document / Image URL)"
            placeholder="e.g. https://..."
            icon={<LinkIcon className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />}
            error={errors.paymentSlip?.message}
            {...register('paymentSlip')}
          />

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-white/8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sticky bottom-0 bg-[#0F1C2E] py-2">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="md"
              className="w-full sm:w-auto shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Employee & Generating Invoice...</span>
                </div>
              ) : (
                'Save Employee & Generate Invoice'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

