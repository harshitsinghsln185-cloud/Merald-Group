import React from 'react';
import {
  X,
  CreditCard,
  DollarSign,
  Edit2,
  Trash2,
  Download,
  ExternalLink,
} from 'lucide-react';
import type { Employee } from '../../types';
import { generatePDFInvoice } from '../../utils/pdfGenerator';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onViewInvoice?: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 max-w-2xl relative">
        {/* Header Banner */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#3B82F6] flex items-center justify-center font-black text-xl text-white shadow-xl">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">{employee.name}</h3>
                <span
                  className={
                    employee.status === 'Active'
                      ? 'badge-active'
                      : employee.status === 'Leave'
                      ? 'badge-leave'
                      : 'badge-inactive'
                  }
                >
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-[#10B981] font-semibold mt-0.5">
                {employee.designation} • {employee.site}
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

        {/* Profile Content Grid */}
        <div className="space-y-6">
          {/* Top Identifiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[rgba(9,20,36,0.8)] border border-[rgba(255,255,255,0.08)] text-xs">
            <div>
              <span className="block text-slate-400 font-semibold text-[10px] uppercase">Employee ID</span>
              <span className="font-mono font-bold text-sky-400">{employee.employeeId}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-semibold text-[10px] uppercase">Employee Code</span>
              <span className="font-mono font-bold text-emerald-400">{employee.employeeCode}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-semibold text-[10px] uppercase">Passport Number</span>
              <span className="font-mono font-bold text-slate-200">{employee.passportNumber}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-semibold text-[10px] uppercase">Sr No</span>
              <span className="font-mono font-bold text-slate-300">#{employee.srNo || 1}</span>
            </div>
          </div>

          {/* Salary Details Card */}
          <div className="p-4 rounded-xl bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <DollarSign className="w-4 h-4" /> Compensation & Salary Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Basic Salary</span>
                <span className="text-base font-bold text-white">${employee.basicSalary.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Payable Salary</span>
                <span className="text-lg font-extrabold text-emerald-400">${employee.payableSalary.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Payable Month</span>
                <span className="text-xs font-semibold text-slate-200">{employee.payableMonth}</span>
              </div>
            </div>
          </div>

          {/* Bank Details Card */}
          <div className="p-4 rounded-xl bg-[rgba(14,165,233,0.05)] border border-[rgba(14,165,233,0.2)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <CreditCard className="w-4 h-4" /> Bank Account & Wire Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Account Number</span>
                <span className="font-mono text-sm font-bold text-white">{employee.accountNumber}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">IFSC / SWIFT Code</span>
                <span className="font-mono text-sm font-bold text-slate-200 uppercase">{employee.ifscCode}</span>
              </div>
            </div>
          </div>

          {/* Location & Contact Details Card */}
          <div className="p-4 rounded-xl bg-[rgba(168,85,247,0.05)] border border-[rgba(168,85,247,0.2)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
              Location & Contact Details
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Country</span>
                <span className="text-xs font-bold text-white">{employee.country || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">State</span>
                <span className="text-xs font-bold text-white">{employee.state || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">City</span>
                <span className="text-xs font-bold text-white">{employee.city || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Phone</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{employee.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Payment Slip Upload Preview if available */}
          {employee.paymentSlip && (
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Payment Slip Attachment
              </span>
              <div className="flex items-center justify-between">
                <a
                  href={employee.paymentSlip}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  View Attachment Link <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.08)] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onDelete(employee._id || employee.employeeId);
            }}
            className="glass-button-danger text-xs py-2 px-3.5 rounded-xl"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Employee
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="glass-button-secondary text-xs py-2 px-3.5 rounded-xl"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Employee
            </button>

            <button
              onClick={() => {
                generatePDFInvoice(employee);
              }}
              className="glass-button text-xs py-2 px-4 rounded-xl"
            >
              <Download className="w-3.5 h-3.5" /> Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
