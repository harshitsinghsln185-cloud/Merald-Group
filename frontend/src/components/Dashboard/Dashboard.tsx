import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import type { DashboardStats, Employee } from '../../types';

interface DashboardProps {
  stats: DashboardStats;
  recentEmployees: Employee[];
  onOpenCreateModal: () => void;
  onOpenEmployees: () => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  recentEmployees,
  onOpenCreateModal,
  onOpenEmployees,
  onSelectEmployee,
}) => {
  // Chart Colors
  const COLORS = {
    active: '#10B981',   // Emerald
    inactive: '#F43F5E', // Rose
    leave: '#F59E0B',    // Amber
  };

  const statusPieData = [
    { name: 'Active', value: stats.active, color: COLORS.active },
    { name: 'Inactive', value: stats.inactive, color: COLORS.inactive },
    { name: 'On Leave', value: stats.leave, color: COLORS.leave },
  ];

  // Monthly Payroll Trend
  const monthlySalaryData = [
    { month: 'Apr 2026', total: 112000 },
    { month: 'May 2026', total: 124000 },
    { month: 'Jun 2026', total: 129000 },
    { month: 'Jul 2026', total: 135000 },
    { month: 'Aug 2026', total: 136500 },
    { month: 'Sep 2026', total: stats.totalSalary || 136500 },
  ];

  const cards = [
    {
      title: 'Total Employees',
      value: stats.total,
      icon: Users,
      trend: '+12% from last month',
      color: 'from-[#10B981] to-[#059669]',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'Active Workforce',
      value: stats.active,
      icon: UserCheck,
      trend: 'Operational readiness: 94%',
      color: 'from-[#0EA5E9] to-[#0284C7]',
      borderColor: 'rgba(14, 165, 233, 0.3)',
    },
    {
      title: 'Inactive Personnel',
      value: stats.inactive,
      icon: UserX,
      trend: 'Under verification / Exit',
      color: 'from-[#F43F5E] to-[#E11D48]',
      borderColor: 'rgba(244, 63, 94, 0.3)',
    },
    {
      title: 'Employees on Leave',
      value: stats.leave,
      icon: Clock,
      trend: 'Scheduled annual leave',
      color: 'from-[#F59E0B] to-[#D97706]',
      borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    {
      title: 'Total Payroll Overview',
      value: `$${stats.totalSalary.toLocaleString()}`,
      icon: DollarSign,
      trend: 'Current Month Payable Total',
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      isCurrency: true,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Executive Welcome Banner */}
      <div className="glass-card p-6 relative overflow-hidden bg-gradient-to-r from-[#0F1C2E] via-[#091424] to-[#0B192C]">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle className="w-3.5 h-3.5" /> Merald Group Enterprise HR Portal
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Corporate HR Analytics & Employee Operations
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring of corporate headcount, monthly payroll discursions, site deployments, and employee documentation.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={onOpenCreateModal} className="glass-button text-xs py-2.5 px-4 rounded-xl">
              <PlusCircle className="w-4 h-4" /> Add New Employee
            </button>
            <button onClick={onOpenEmployees} className="glass-button-secondary text-xs py-2.5 px-4 rounded-xl">
              View All Directory
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="glass-card p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              style={{ borderColor: card.borderColor }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  {card.value}
                </span>
                <p className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  {card.trend}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Employee Status Breakdown</h3>
              <p className="text-xs text-slate-400">Distribution of workforce states</p>
            </div>
          </div>

          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F1C2E',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-white">{stats.total}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Personnel</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)] text-center">
            <div className="p-2 rounded-xl bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)]">
              <span className="block text-xs text-emerald-400 font-bold">Active</span>
              <span className="text-sm font-extrabold text-white">{stats.active}</span>
            </div>
            <div className="p-2 rounded-xl bg-[rgba(244,63,94,0.08)] border border-[rgba(244,63,94,0.2)]">
              <span className="block text-xs text-rose-400 font-bold">Inactive</span>
              <span className="text-sm font-extrabold text-white">{stats.inactive}</span>
            </div>
            <div className="p-2 rounded-xl bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]">
              <span className="block text-xs text-amber-400 font-bold">On Leave</span>
              <span className="text-sm font-extrabold text-white">{stats.leave}</span>
            </div>
          </div>
        </div>

        {/* Monthly Payroll Area Chart */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Payroll Expenditures Overview</h3>
              <p className="text-xs text-slate-400">Total payable salary discursions across 2026</p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-xs text-emerald-400 font-bold">
              Current Month: ${stats.totalSalary.toLocaleString()}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalaryData}>
                <defs>
                  <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v: number) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F1C2E',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#FFF',
                  }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Total Payable']}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSalary)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Entries Feed */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Recent Employee Entries</h3>
            <p className="text-xs text-slate-400">Latest added workforce records in the system</p>
          </div>
          <button
            onClick={onOpenEmployees}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View All Employees <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {recentEmployees.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">No recent employees found.</div>
        ) : (
          <div className="enterprise-table-container">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Passport No</th>
                  <th>Designation</th>
                  <th>Site</th>
                  <th>Payable Salary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.slice(0, 5).map((emp) => (
                  <tr key={emp._id || emp.employeeCode}>
                    <td className="font-mono font-bold text-emerald-400">{emp.employeeCode}</td>
                    <td className="font-semibold text-white">{emp.name}</td>
                    <td className="font-mono text-slate-300">{emp.passportNumber}</td>
                    <td className="text-slate-300">{emp.designation}</td>
                    <td className="text-slate-400">{emp.site}</td>
                    <td className="font-bold text-emerald-400">${emp.payableSalary.toLocaleString()}</td>
                    <td>
                      <span
                        className={
                          emp.status === 'Active'
                            ? 'badge-active'
                            : emp.status === 'Leave'
                            ? 'badge-leave'
                            : 'badge-inactive'
                        }
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => onSelectEmployee(emp)}
                        className="text-xs font-bold text-slate-300 hover:text-white bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] transition-all"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
