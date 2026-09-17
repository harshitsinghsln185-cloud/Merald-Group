import React, { useState } from 'react';
import {
  Search,
  FileSpreadsheet,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building,
  RefreshCw,
  Upload,
  Receipt,
} from 'lucide-react';
import type { Employee, PaginationMeta } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

interface EmployeeListPageProps {
  employees: Employee[];
  pagination: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: string) => void;
  onSelectEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  onViewInvoice: (employee: Employee) => void;
  onOpenPaymentSlip: (employee: Employee) => void;
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
}

export const EmployeeListPage: React.FC<EmployeeListPageProps> = ({
  employees,
  pagination,
  loading,
  onPageChange,
  onSearchChange,
  onStatusFilterChange,
  onSelectEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewInvoice,
  onOpenPaymentSlip,
  onOpenCreateModal,
  onOpenImportModal,
  onExportExcel,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInput);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    onSearchChange('');
    onStatusFilterChange('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header Controls Bar */}
      <div className="glass-card p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <UserCheck className="w-3.5 h-3.5" /> Directory Management
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Get All Employees Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View, search, edit, delete, import Excel, and generate payment slips for all registered staff.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onOpenImportModal} variant="secondary" size="md">
            <Upload className="w-4 h-4 text-emerald-400" /> Import Employees
          </Button>
          <Button onClick={onExportExcel} variant="secondary" size="md">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export All to Excel
          </Button>
          <Button onClick={onOpenCreateModal} variant="primary" size="md">
            <Plus className="w-4 h-4" /> Create Employee
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto flex-1">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Passport Number or Employee Code..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="glass-input pl-10 pr-4 py-2.5 text-xs rounded-xl border-white/10 focus:border-emerald-500 w-full"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              onStatusFilterChange(e.target.value);
            }}
            className="glass-input py-2.5 px-3 text-xs rounded-xl bg-[#091424] border-white/10 text-slate-200 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="LEAVE">ON LEAVE</option>
          </select>

          {(searchInput || statusFilter) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Building className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Employees Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No employee matches your current passport or code search parameters.
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <Button onClick={onOpenImportModal} variant="secondary" size="sm">
                Import from Excel
              </Button>
              <Button onClick={onOpenCreateModal} size="sm">
                Add First Employee
              </Button>
            </div>
          </div>
        ) : (
          <div className="enterprise-table-container">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Employee Code</th>
                  <th>Employee Name</th>
                  <th>Passport Number</th>
                  <th>Designation</th>
                  <th>Site</th>
                  <th>Basic Salary</th>
                  <th>Payable Salary</th>
                  <th>Month</th>
                  <th>Account Number</th>
                  <th>IFSC Code</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp._id || emp.employeeCode}>
                    <td className="font-mono text-slate-400 font-semibold text-xs">
                      {emp.srNo || (pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="font-mono font-bold text-emerald-400 text-xs">
                      {emp.employeeCode}
                    </td>
                    <td className="font-bold text-white text-xs">{emp.name}</td>
                    <td className="font-mono text-slate-300 text-xs uppercase tracking-wider">
                      {emp.passportNumber}
                    </td>
                    <td className="text-slate-300 text-xs">{emp.designation}</td>
                    <td className="text-slate-400 text-xs max-w-[150px] truncate" title={emp.site}>
                      {emp.site}
                    </td>
                    <td className="font-semibold text-slate-300 text-xs">
                      ${emp.basicSalary.toLocaleString()}
                    </td>
                    <td className="font-bold text-emerald-400 text-xs">
                      ${emp.payableSalary.toLocaleString()}
                    </td>
                    <td className="text-slate-400 text-xs">{emp.payableMonth}</td>
                    <td className="font-mono text-slate-300 text-xs">{emp.accountNumber}</td>
                    <td className="font-mono text-slate-300 text-xs uppercase">{emp.ifscCode}</td>
                    <td>
                      <Badge status={emp.status} />
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectEmployee(emp)}
                          className="p-1.5 rounded-lg bg-white/6 hover:bg-white/12 text-slate-300 hover:text-white transition-all cursor-pointer"
                          title="View Details & Salary History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenPaymentSlip(emp)}
                          className="p-1.5 rounded-lg bg-emerald-500/12 hover:bg-emerald-500/25 text-emerald-400 transition-all cursor-pointer"
                          title="Generate Payment Slip"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className="p-1.5 rounded-lg bg-sky-500/12 hover:bg-sky-500/25 text-sky-400 transition-all cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onViewInvoice(emp)}
                          className="p-1.5 rounded-lg bg-amber-500/12 hover:bg-amber-500/25 text-amber-400 transition-all cursor-pointer"
                          title="Download Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee(emp._id || emp.employeeId)}
                          className="p-1.5 rounded-lg bg-rose-500/12 hover:bg-rose-500/25 text-rose-400 transition-all cursor-pointer"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="p-4 border-t border-white/8 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page <strong className="text-white">{pagination.page}</strong> of{' '}
              <strong className="text-white">{pagination.pages}</strong> ({pagination.total} total employees)
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      p === pagination.page
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-white/4 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page === pagination.pages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
