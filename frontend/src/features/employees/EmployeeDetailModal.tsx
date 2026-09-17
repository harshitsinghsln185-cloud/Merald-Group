import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Edit2,
  Trash2,
  Download,
  ExternalLink,
  FileText,
  History,
  ArrowUpRight,
} from 'lucide-react';
import type { Employee } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { generatePDFInvoice } from '../../utils/pdfGenerator';
import { employeeService } from '../../services/employee.service';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onOpenPaymentSlip: (employee: Employee, month?: number, year?: number) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onOpenPaymentSlip,
}) => {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (employee && isOpen) {
      setLoadingHistory(true);
      employeeService
        .getSalaryHistory(employee._id || employee.employeeId)
        .then((res) => {
          if (res && res.data) {
            setHistoryList(res.data);
          } else {
            setHistoryList([]);
          }
        })
        .catch(() => setHistoryList([]))
        .finally(() => setLoadingHistory(false));
    }
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center font-black text-xl text-white shadow-xl shrink-0">
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">{employee.name}</h3>
              <Badge status={employee.status} />
            </div>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
              {employee.designation} • {employee.site}
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            onClose();
            onOpenPaymentSlip(employee);
          }}
          variant="primary"
          size="sm"
          className="hidden sm:inline-flex"
        >
          <FileText className="w-4 h-4" /> Payment Slip
        </Button>
      </div>

      <div className="space-y-6">
        {/* Identifiers Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#091424] border border-white/8 text-xs">
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

        {/* Current Compensation Card */}
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <DollarSign className="w-4 h-4" /> Current Compensation & Salary
            </div>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Active Pay Cycle
            </span>
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

        {/* Salary History Feature Table */}
        <div className="p-4 rounded-xl bg-white/3 border border-white/8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <History className="w-4 h-4 text-emerald-400" /> Historical Monthly Payout Records
            </div>
            <span className="text-[11px] text-slate-400">Click any month to generate payment slip</span>
          </div>

          {loadingHistory ? (
            <div className="p-4 text-center text-xs text-slate-400">Loading historical salary records...</div>
          ) : historyList.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No historical salary records found. Standard active payout: {employee.payableMonth}.
            </div>
          ) : (
            <div className="enterprise-table-container max-h-48 overflow-y-auto">
              <table className="enterprise-table text-xs">
                <thead>
                  <tr>
                    <th>Month & Year</th>
                    <th>Basic Salary</th>
                    <th>Payable Salary</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((h, idx) => (
                    <tr key={idx}>
                      <td className="font-bold text-white">{h.payableMonth || `${h.month}/${h.year}`}</td>
                      <td className="text-slate-300">${(h.basicSalary || employee.basicSalary).toLocaleString()}</td>
                      <td className="font-bold text-emerald-400">${(h.payableSalary || employee.payableSalary).toLocaleString()}</td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenPaymentSlip(employee, h.month, h.year);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition-all cursor-pointer"
                        >
                          Payment Slip <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bank Details */}
        <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-3">
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

        {employee.paymentSlip && (
          <div className="p-4 rounded-xl bg-white/3 border border-white/8 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Payment Slip Attachment Link
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

      <div className="mt-8 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3">
        <Button
          onClick={() => {
            onClose();
            onDelete(employee._id || employee.employeeId);
          }}
          variant="danger"
          size="sm"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Employee
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => {
              onClose();
              onOpenPaymentSlip(employee);
            }}
            variant="secondary"
            size="sm"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Payment Slip
          </Button>

          <Button
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
            variant="secondary"
            size="sm"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Employee
          </Button>

          <Button
            onClick={() => {
              generatePDFInvoice(employee);
            }}
            variant="primary"
            size="sm"
          >
            <Download className="w-3.5 h-3.5" /> Invoice PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
