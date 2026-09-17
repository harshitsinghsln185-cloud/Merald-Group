import React, { useState, useEffect } from 'react';
import { X, Edit2, Save } from 'lucide-react';
import type { Employee, EmployeeStatus } from '../../types';
import { useLocationData } from '../../hooks/useLocationData';
import { LocationFields } from '../common/LocationFields';

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
  const [formData, setFormData] = useState({
    name: '',
    passportNumber: '',
    designation: '',
    site: '',
    basicSalary: '',
    payableSalary: '',
    payableMonth: '',
    accountNumber: '',
    ifscCode: '',
    status: 'Active' as EmployeeStatus,
  });

  const location = useLocationData({
    country: employee?.country || '',
    state: employee?.state || '',
    city: employee?.city || '',
    phone: employee?.phone || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (employee && isOpen) {
      setFormData({
        name: employee.name || '',
        passportNumber: employee.passportNumber || '',
        designation: employee.designation || '',
        site: employee.site || '',
        basicSalary: String(employee.basicSalary || ''),
        payableSalary: String(employee.payableSalary || ''),
        payableMonth: employee.payableMonth || 'September 2026',
        accountNumber: employee.accountNumber || '',
        ifscCode: employee.ifscCode || '',
        status: employee.status || 'Active',
      });
      location.resetLocation({
        country: employee.country || '',
        state: employee.state || '',
        city: employee.city || '',
        phone: employee.phone || '',
      });
    }
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setSubmitting(true);
      await onSubmit(employee._id || employee.employeeId, {
        ...formData,
        basicSalary: Number(formData.basicSalary),
        payableSalary: Number(formData.payableSalary),
        country: location.countryName,
        state: location.stateName,
        city: location.cityName,
        phone: location.fullPhone,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 relative max-w-2xl w-full">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-[#3B82F6] flex items-center justify-center text-white font-bold shadow-lg">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Edit Employee Details</h3>
              <p className="text-xs text-slate-400">
                Updating record for <span className="text-emerald-400 font-mono font-bold">{employee.employeeCode}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Employee Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Passport Number
              </label>
              <input
                type="text"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                required
                className="glass-input font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Site Location
              </label>
              <input
                type="text"
                name="site"
                value={formData.site}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Basic Salary ($)
              </label>
              <input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Payable Salary ($)
              </label>
              <input
                type="number"
                name="payableSalary"
                value={formData.payableSalary}
                onChange={handleChange}
                required
                className="glass-input font-bold text-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Payable Month
              </label>
              <input
                type="text"
                name="payableMonth"
                value={formData.payableMonth}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="glass-input bg-[#091424] cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                className="glass-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                IFSC / SWIFT Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                required
                className="glass-input font-mono uppercase"
              />
            </div>
          </div>

          {/* Location & Phone Fields */}
          <div className="pt-2 border-t border-[rgba(255,255,255,0.08)]">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-3">
              Location & Contact Information
            </h4>
            <LocationFields location={location} />
          </div>

          <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="glass-button-secondary text-xs py-2 px-4 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="glass-button text-xs py-2 px-5 rounded-xl"
            >
              <Save className="w-4 h-4" /> {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

