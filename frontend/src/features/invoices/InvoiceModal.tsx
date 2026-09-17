import React, { useEffect, useState } from 'react';
import { X, Download, Building2, Printer, ShieldCheck, CreditCard } from 'lucide-react';
import type { Employee, Invoice } from '../../types';
import { invoiceService } from '../../services/invoice.service';
import { generatePDFInvoice } from '../../utils/pdfGenerator';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface InvoiceModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee && isOpen) {
      setLoading(true);
      invoiceService
        .getInvoice(employee._id || employee.employeeId)
        .then((res: any) => {
          if (res.success && res.data) {
            setInvoice(res.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 max-w-3xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-extrabold text-white">Official Payroll Invoice</h3>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>

            <Button
              onClick={() => generatePDFInvoice(employee, invoice)}
              variant="primary"
              size="sm"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </Button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all ml-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading invoice document...</div>
        ) : (
          <div className="bg-[#091424] border border-white/12 rounded-2xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                  M
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-wider text-white">
                    MERALD<span className="text-emerald-400">GROUP</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Corporate HR & Payroll Discursion Department
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-1">
                  INVOICE #: {invoice?.invoiceNumber || `MGD-INV-2026-991`}
                </span>
                <p className="text-xs text-slate-400 font-medium">
                  Date:{' '}
                  {new Date(invoice?.generatedDate || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Employee Information
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/3 border border-white/6 text-xs">
                <div>
                  <span className="text-slate-400 block">Employee Code</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{employee.employeeCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Employee Name</span>
                  <span className="font-bold text-white text-sm">{employee.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Passport Number</span>
                  <span className="font-mono font-bold text-slate-200">{employee.passportNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Designation</span>
                  <span className="font-semibold text-slate-300">{employee.designation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Site Location</span>
                  <span className="font-semibold text-slate-300">{employee.site}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Status</span>
                  <Badge status={employee.status} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Salary & Payroll Discursion Details
              </h4>
              <div className="enterprise-table-container">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Salary Description</th>
                      <th>Payable Month</th>
                      <th>Currency</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-semibold text-white">Basic Employee Compensation</td>
                      <td className="text-slate-400">{employee.payableMonth}</td>
                      <td className="text-slate-400">USD / AED</td>
                      <td className="text-right font-mono font-semibold text-slate-300">
                        ${employee.basicSalary.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-emerald-400">Total Payable Compensation</td>
                      <td className="text-slate-400">{employee.payableMonth}</td>
                      <td className="text-slate-400">USD / AED</td>
                      <td className="text-right font-mono font-bold text-emerald-400 text-base">
                        ${employee.payableSalary.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-sky-500/8 border border-sky-500/20">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Wire Bank Account Details
                </h4>
                <div className="space-y-1 text-xs">
                  <p className="text-slate-300">
                    Account Number: <strong className="font-mono text-white">{employee.accountNumber}</strong>
                  </p>
                  <p className="text-slate-300">
                    IFSC / SWIFT Code: <strong className="font-mono text-white uppercase">{employee.ifscCode}</strong>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-center items-end text-right">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Total Discursion Payable
                </span>
                <span className="text-2xl font-black text-emerald-400 mt-1">
                  ${employee.payableSalary.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/8 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Authorized Computer-Generated Invoice for Merald Group</span>
              </div>
              <div className="border border-emerald-500/40 rounded-lg px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase">
                Official HR Seal Approved
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
