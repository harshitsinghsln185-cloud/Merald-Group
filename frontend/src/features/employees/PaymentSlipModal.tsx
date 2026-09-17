import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  AlertCircle,
  Building2,
  CheckCircle2,
  CreditCard,
  User,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Employee } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { employeeService } from '../../services/employee.service';

interface PaymentSlipModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  initialMonth?: number;
  initialYear?: number;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const PaymentSlipModal: React.FC<PaymentSlipModalProps> = ({
  employee,
  isOpen,
  onClose,
  initialMonth = 9,
  initialYear = 2026,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [slipData, setSlipData] = useState<any | null>(null);

  useEffect(() => {
    if (employee && isOpen) {
      // Determine initial month/year from employee payableMonth if possible
      const pMonth = employee.payableMonth || 'September 2026';
      let m = 9;
      let y = 2026;
      MONTH_NAMES.forEach((name, idx) => {
        if (pMonth.toLowerCase().includes(name.toLowerCase())) {
          m = idx + 1;
        }
      });
      const yearMatch = pMonth.match(/\d{4}/);
      if (yearMatch) {
        y = parseInt(yearMatch[0], 10);
      }

      setSelectedMonth(initialMonth || m);
      setSelectedYear(initialYear || y);
      fetchPaymentSlip(initialMonth || m, initialYear || y);
    }
  }, [employee, isOpen, initialMonth, initialYear]);

  const fetchPaymentSlip = async (m: number, y: number) => {
    if (!employee) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await employeeService.getPaymentSlip(
        employee._id || employee.employeeId,
        m,
        y
      );
      if (res && res.success && res.data) {
        setSlipData(res.data);
      } else {
        throw new Error(res?.message || 'No payment data available for this month.');
      }
    } catch (err: any) {
      setSlipData(null);
      setErrorMsg(err.message || `No payment data available for ${MONTH_NAMES[m - 1]} ${y}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthYearChange = (m: number, y: number) => {
    setSelectedMonth(m);
    setSelectedYear(y);
    fetchPaymentSlip(m, y);
  };

  const handleDownloadPDF = () => {
    if (!slipData || !employee) return;

    const doc = new jsPDF();

    // Dark Gold & Navy Enterprise Header
    doc.setFillColor(7, 15, 30);
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('MERALD GROUP', 14, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text('ENTERPRISE HR & PAYROLL SYSTEM', 14, 30);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT SLIP', 196, 22, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`Ref: ${slipData.paymentSlipNumber}`, 196, 30, { align: 'right' });

    // Section 1: Employee Information
    doc.setTextColor(7, 15, 30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Employee Credentials', 14, 55);

    autoTable(doc, {
      startY: 58,
      theme: 'grid',
      headStyles: { fillColor: [15, 28, 46], textColor: [255, 255, 255], fontStyle: 'bold' },
      body: [
        ['Employee Name:', slipData.employee.name, 'Employee Code:', slipData.employee.employeeCode],
        ['Passport Number:', slipData.employee.passportNumber, 'Employee ID:', slipData.employee.employeeId],
        ['Designation:', slipData.employee.designation, 'Site Location:', slipData.employee.site],
      ],
      styles: { fontSize: 9, cellPadding: 3 },
    });

    // Section 2: Compensation Breakdown
    const nextY1 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Salary & Payout Details', 14, nextY1);

    autoTable(doc, {
      startY: nextY1 + 3,
      theme: 'striped',
      head: [['Salary Component', 'Month / Period', 'Amount ($)']],
      body: [
        ['Basic Salary', `${slipData.salary.salaryMonth} ${slipData.salary.salaryYear}`, `$${slipData.salary.basicSalary.toLocaleString()}`],
        ['Payable Net Payout', `${slipData.salary.salaryMonth} ${slipData.salary.salaryYear}`, `$${slipData.salary.payableSalary.toLocaleString()}`],
      ],
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    // Section 3: Bank Wire Details
    const nextY2 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Bank Wire & Account Information', 14, nextY2);

    autoTable(doc, {
      startY: nextY2 + 3,
      theme: 'plain',
      body: [
        ['Bank Account Number:', slipData.bank.accountNumber],
        ['IFSC / SWIFT Code:', slipData.bank.ifscCode],
        ['Payment Status:', 'PAID (Verified Electronic Wire)'],
        ['Generated Date:', new Date(slipData.paymentInfo.generatedDate).toLocaleDateString()],
      ],
      styles: { fontSize: 9, cellPadding: 3 },
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'This document is an official computer-generated payment voucher produced by Merald Group EMS.',
      14,
      280
    );

    doc.save(`Merald_Group_Payment_Slip_${employee.employeeCode}_${slipData.salary.salaryMonth}_${slipData.salary.salaryYear}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen || !employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Payment Slip Voucher"
      icon={<FileText className="w-5 h-5" />}
      maxWidth="max-w-3xl"
    >
      {/* Month & Year Selection Header */}
      <div className="p-4 rounded-xl bg-[#091424] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Calendar className="w-4 h-4 text-emerald-400" /> Select Payout Period:
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthYearChange(Number(e.target.value), selectedYear)}
            className="glass-input text-xs py-2 px-3 bg-[#0F1C2E] border-white/10 cursor-pointer font-semibold text-white"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={idx} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => handleMonthYearChange(selectedMonth, Number(e.target.value))}
            className="glass-input text-xs py-2 px-3 bg-[#0F1C2E] border-white/10 cursor-pointer font-semibold text-white"
          >
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold">Generating Payment Slip Voucher...</p>
        </div>
      ) : errorMsg || !slipData ? (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3 my-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h4 className="text-base font-bold text-white">No Payment Data Available</h4>
          <p className="text-xs text-rose-300 max-w-md mx-auto">
            {errorMsg || `No salary/payment data available for ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}.`}
          </p>
        </div>
      ) : (
        /* Printable Voucher Card */
        <div id="printable-payment-slip" className="space-y-6">
          <div className="glass-card p-6 sm:p-8 border border-white/12 bg-gradient-to-b from-[#0F1C2E] to-[#091424] relative overflow-hidden shadow-2xl">
            {/* Watermark Logo */}
            <div className="absolute right-4 bottom-4 text-white/2 pointer-events-none">
              <Building2 className="w-64 h-64" />
            </div>

            {/* Voucher Branding Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white shadow-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wider">
                    MERALD<span className="text-emerald-400">GROUP</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Official Corporate Payroll Voucher
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAYMENT SLIP
                </span>
                <p className="text-[11px] font-mono text-slate-400 font-bold mt-1.5">
                  Ref: <span className="text-sky-400">{slipData.paymentSlipNumber}</span>
                </p>
              </div>
            </div>

            {/* Employee Info Grid */}
            <div className="py-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <User className="w-4 h-4" /> Employee Credentials & Profile
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#070F1E]/80 border border-white/8 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Employee Code</span>
                  <span className="font-mono font-bold text-emerald-400">{slipData.employee.employeeCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Employee Name</span>
                  <span className="font-bold text-white">{slipData.employee.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Passport Number</span>
                  <span className="font-mono font-bold text-slate-200">{slipData.employee.passportNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Designation</span>
                  <span className="font-semibold text-slate-300">{slipData.employee.designation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Site Location</span>
                  <span className="font-semibold text-slate-300">{slipData.employee.site}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">System ID</span>
                  <span className="font-mono text-slate-400">{slipData.employee.employeeId}</span>
                </div>
              </div>
            </div>

            {/* Salary Breakdown Table */}
            <div className="py-2 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <DollarSign className="w-4 h-4" /> Salary & Payout Structure
              </div>

              <div className="enterprise-table-container">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Pay Component</th>
                      <th>Payout Month</th>
                      <th>Payout Year</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold text-white">Basic Monthly Salary</td>
                      <td className="text-slate-300">{slipData.salary.salaryMonth}</td>
                      <td className="text-slate-300">{slipData.salary.salaryYear}</td>
                      <td className="font-bold text-slate-200 text-right">
                        ${slipData.salary.basicSalary.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-emerald-500/5">
                      <td className="font-extrabold text-emerald-400">Total Net Payable Payout</td>
                      <td className="text-emerald-400 font-bold">{slipData.salary.salaryMonth}</td>
                      <td className="text-emerald-400 font-bold">{slipData.salary.salaryYear}</td>
                      <td className="font-extrabold text-emerald-400 text-base text-right">
                        ${slipData.salary.payableSalary.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bank Info & Verification Footer */}
            <div className="pt-6 mt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/3 border border-white/6 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-300">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> Bank Wire Details
                </div>
                <p className="text-slate-400 font-mono text-[11px] pt-1">
                  Account: <strong className="text-white">{slipData.bank.accountNumber}</strong>
                </p>
                <p className="text-slate-400 font-mono text-[11px]">
                  IFSC / SWIFT: <strong className="text-slate-200">{slipData.bank.ifscCode}</strong>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/3 border border-white/6 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-sky-400" /> Verification Status
                </div>
                <p className="text-slate-400 text-[11px] pt-1">
                  Status: <span className="text-emerald-400 font-bold">PAID</span>
                </p>
                <p className="text-slate-400 text-[11px]">
                  Generated Date:{' '}
                  <span className="text-slate-200">
                    {new Date(slipData.paymentInfo.generatedDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Actions Footer */}
      <div className="mt-6 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3 print-hide">
        <Button onClick={onClose} variant="secondary" size="sm">
          Close
        </Button>

        <div className="flex items-center gap-3">
          <Button
            onClick={handlePrint}
            disabled={!slipData || loading}
            variant="secondary"
            size="sm"
          >
            <Printer className="w-4 h-4" /> Print Payment Slip
          </Button>

          <Button
            onClick={handleDownloadPDF}
            disabled={!slipData || loading}
            variant="primary"
            size="sm"
          >
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
