import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit2, Save } from 'lucide-react';
import type { Employee } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const employeeEditSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  passportNumber: z.string().min(3, 'Passport number is required'),
  designation: z.string().min(2, 'Designation is required'),
  site: z.string().min(2, 'Site location is required'),
  basicSalary: z.coerce.number().min(0, 'Basic salary must be positive'),
  payableSalary: z.coerce.number().min(0, 'Payable salary must be positive'),
  payableMonth: z.string().min(3, 'Payable month is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  ifscCode: z.string().min(3, 'IFSC / SWIFT code is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'LEAVE']),
});

type EmployeeEditFormData = z.infer<typeof employeeEditSchema>;

interface EmployeeEditModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<Employee>) => Promise<void>;
}

export const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({
  employee,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeEditFormData>({
    resolver: zodResolver(employeeEditSchema),
  });

  useEffect(() => {
    if (employee && isOpen) {
      reset({
        name: employee.name || '',
        passportNumber: employee.passportNumber || '',
        designation: employee.designation || '',
        site: employee.site || '',
        basicSalary: employee.basicSalary || 0,
        payableSalary: employee.payableSalary || 0,
        payableMonth: employee.payableMonth || 'September 2026',
        accountNumber: employee.accountNumber || '',
        ifscCode: employee.ifscCode || '',
        status: (employee.status ? (employee.status.toUpperCase() as any) : 'ACTIVE'),
      });
    }
  }, [employee, isOpen, reset]);

  if (!isOpen || !employee) return null;

  const onFormSubmit = async (data: EmployeeEditFormData) => {
    setErrorMsg('');
    try {
      await onSubmit(employee._id || employee.employeeId, data);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update employee');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Employee Details"
      icon={<Edit2 className="w-5 h-5" />}
    >
      {errorMsg && (
        <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Employee Name"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Passport Number"
            className="uppercase font-mono"
            error={errors.passportNumber?.message}
            {...register('passportNumber')}
          />

          <Input
            label="Designation"
            error={errors.designation?.message}
            {...register('designation')}
          />

          <Input
            label="Site Location"
            error={errors.site?.message}
            {...register('site')}
          />

          <Input
            label="Basic Salary ($)"
            type="number"
            error={errors.basicSalary?.message}
            {...register('basicSalary')}
          />

          <Input
            label="Payable Salary ($)"
            type="number"
            error={errors.payableSalary?.message}
            {...register('payableSalary')}
          />

          <Input
            label="Payable Month"
            error={errors.payableMonth?.message}
            {...register('payableMonth')}
          />

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              {...register('status')}
              className="glass-input bg-[#091424] cursor-pointer"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="LEAVE">ON LEAVE</option>
            </select>
          </div>

          <Input
            label="Account Number"
            className="font-mono"
            error={errors.accountNumber?.message}
            {...register('accountNumber')}
          />

          <Input
            label="IFSC / SWIFT Code"
            className="font-mono uppercase"
            error={errors.ifscCode?.message}
            {...register('ifscCode')}
          />
        </div>

        <div className="pt-4 border-t border-white/8 flex items-center justify-end gap-3">
          <Button type="button" onClick={onClose} variant="secondary" size="md">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="primary" size="md">
            <Save className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
