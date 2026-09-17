import React, { useState, useEffect } from 'react';
import { X, Sparkles, UserPlus } from 'lucide-react';
import type { Employee, EmployeeStatus } from '../../types';

interface EmployeeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: Partial<Employee>) => Promise<void>;
  totalCount: number;
}

export const EmployeeCreateModal: React.FC<EmployeeCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  totalCount,
}) => {
  const [formData, setFormData] = useState({
    srNo: totalCount + 1,
    employeeId: '',
    employeeCode: '',
    name: '',
    passportNumber: '',
    designation: '',
    site: '',
    basicSalary: '',
    payableSalary: '',
    payableMonth: 'September 2026',
    accountNumber: '',
    ifscCode: '',
    paymentSlip: '',
    status: 'Active' as EmployeeStatus,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto Generate Employee ID and Employee Code on mount / change
  useEffect(() => {
    if (isOpen) {
      const nextId = `EMP-${1000 + totalCount + 1}`;
      const nextCode = `MGD-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData((prev) => ({
        ...prev,
        srNo: totalCount + 1,
        employeeId: nextId,
        employeeCode: nextCode,
      }));
    }
  }, [isOpen, totalCount]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto match payable salary to basic salary if payable is empty or equal
      if (name === 'basicSalary' && (!prev.payableSalary || prev.payableSalary === prev.basicSalary)) {
        updated.payableSalary = value;
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !formData.name ||
      !formData.passportNumber ||
      !formData.designation ||
      !formData.site ||
      !formData.basicSalary ||
      !formData.payableSalary ||
      !formData.accountNumber ||
      !formData.ifscCode
    ) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        basicSalary: Number(formData.basicSalary),
        payableSalary: Number(formData.payableSalary),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create employee record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#0EA5E9] flex items-center justify-center text-white font-bold shadow-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Create Employee Record</h3>
              <p className="text-xs text-slate-400">
                Merald Group HR Payroll & Documentation Onboarding
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

        {/* Auto Generated Badge */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-[rgba(16,185,129,0.1)] to-[rgba(14,165,233,0.1)] border border-[rgba(16,185,129,0.3)] flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Auto Generated IDs:</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <span className="text-sky-400">ID: {formData.employeeId}</span>
            <span className="text-emerald-400">CODE: {formData.employeeCode}</span>
          </div>
        </div>

        {/* Form Fields Grid */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sr No */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Sr No
              </label>
              <input
                type="number"
                name="srNo"
                value={formData.srNo}
                readOnly
                className="glass-input bg-slate-900/60 text-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Employee Code */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Employee Code (Auto)
              </label>
              <input
                type="text"
                name="employeeCode"
                value={formData.employeeCode}
                readOnly
                className="glass-input bg-slate-900/60 text-emerald-400 font-mono font-bold cursor-not-allowed"
              />
            </div>

            {/* Employee Name */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Employee Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Sarah Al-Mansoor"
                value={formData.name}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            {/* Passport Number */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Passport Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="passportNumber"
                placeholder="e.g. N9824152A"
                value={formData.passportNumber}
                onChange={handleChange}
                required
                className="glass-input uppercase font-mono"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Designation <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="designation"
                placeholder="e.g. Project Director"
                value={formData.designation}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            {/* Site */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Site Location <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="site"
                placeholder="e.g. Dubai South Tower"
                value={formData.site}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            {/* Basic Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Basic Salary ($ / AED) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="basicSalary"
                placeholder="e.g. 18500"
                value={formData.basicSalary}
                onChange={handleChange}
                required
                className="glass-input font-semibold"
              />
            </div>

            {/* Payable Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Payable Salary ($ / AED) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="payableSalary"
                placeholder="e.g. 18500"
                value={formData.payableSalary}
                onChange={handleChange}
                required
                className="glass-input font-bold text-emerald-400"
              />
            </div>

            {/* Month of Payable Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Month of Payable Salary <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="payableMonth"
                placeholder="e.g. September 2026"
                value={formData.payableMonth}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            {/* Employee Status */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Employee Status
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

            {/* Account Number */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Account Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="accountNumber"
                placeholder="e.g. AE480330000001294857102"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                className="glass-input font-mono"
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                IFSC / SWIFT Code <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="ifscCode"
                placeholder="e.g. EBILAE2DXXX"
                value={formData.ifscCode}
                onChange={handleChange}
                required
                className="glass-input font-mono uppercase"
              />
            </div>
          </div>

          {/* Payment Slip Upload / Link */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Payment Slip (Image / Document Link)
            </label>
            <input
              type="text"
              name="paymentSlip"
              placeholder="Paste payment slip image URL (Optional)"
              value={formData.paymentSlip}
              onChange={handleChange}
              className="glass-input text-xs"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="glass-button-secondary text-xs py-2.5 px-4 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="glass-button text-xs py-2.5 px-5 rounded-xl"
            >
              {submitting ? 'Generating Invoice & Saving...' : 'Save & Auto Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
