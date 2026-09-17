import React, { useState } from 'react';
import {
  Search,
  Bell,
  Globe,
  X,
  FileSpreadsheet,
  UserPlus,
} from 'lucide-react';
import type { Admin } from '../../types';

interface HeaderProps {
  admin: Admin | null;
  currentTab: string;
  onQuickSearch: (query: string) => void;
  onOpenCreateModal: () => void;
  onExportExcel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  admin,
  currentTab,
  onQuickSearch,
  onOpenCreateModal,
  onExportExcel,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Automated Invoice Generated',
      time: '10 mins ago',
      desc: 'Payroll invoice generated for Sarah Al-Mansoor (EMP-1001)',
      type: 'invoice',
    },
    {
      id: 2,
      title: 'New Employee Onboarded',
      time: '1 hour ago',
      desc: 'David Richardson added under Abu Dhabi Commercial Hub',
      type: 'user',
    },
    {
      id: 3,
      title: 'System Security Audit',
      time: '2 hours ago',
      desc: 'JWT authentication validated for active admin session',
      type: 'security',
    },
  ];

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Executive Analytics Dashboard';
      case 'employees':
        return 'Employee Records Directory';
      case 'create-employee':
        return 'Create Employee Record';
      case 'reports':
        return 'Invoices & Payroll Reports';
      default:
        return 'Enterprise Management System';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onQuickSearch(searchVal.trim());
    }
  };

  return (
    <header className="h-20 bg-[#070F1E]/80 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
          <span>Merald Group</span>
          <span>•</span>
          <span className="text-slate-400">{admin?.city || 'Dubai HQ'}</span>
        </div>
        <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
          {getTabTitle()}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
          <input
            type="text"
            placeholder="Search Passport or Code..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="glass-input pl-10 pr-4 py-2 text-xs rounded-xl border-[rgba(255,255,255,0.1)] focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        {/* Action Buttons */}
        <button
          onClick={onOpenCreateModal}
          className="glass-button text-xs py-2 px-3.5 rounded-xl hidden sm:inline-flex"
        >
          <UserPlus className="w-4 h-4" /> Add Employee
        </button>

        <button
          onClick={onExportExcel}
          className="glass-button-secondary text-xs py-2 px-3.5 rounded-xl hidden lg:inline-flex"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
        </button>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-slate-300 flex items-center justify-center relative border border-[rgba(255,255,255,0.08)] transition-all"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute top-2 right-2 ring-4 ring-[#070F1E]" />
          </button>

          {/* Notifications Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#0F1C2E] border border-[rgba(255,255,255,0.15)] rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)] mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm text-white">Notifications</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition-all border border-[rgba(255,255,255,0.05)]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.08)] text-center">
                <span className="text-[11px] text-emerald-400 font-semibold cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Country Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs text-slate-300 font-semibold">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{admin?.country || 'UAE'}</span>
        </div>
      </div>
    </header>
  );
};
