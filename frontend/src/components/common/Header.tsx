import React, { useState } from 'react';
import { Search, Bell, Globe, X, FileSpreadsheet, UserPlus, Upload, Menu } from 'lucide-react';
import type { Admin } from '../../types';
import { Button } from '../ui/Button';

interface HeaderProps {
  admin: Admin | null;
  currentPathName?: string;
  onQuickSearch: (query: string) => void;
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  admin,
  currentPathName = 'Executive Dashboard',
  onQuickSearch,
  onOpenCreateModal,
  onOpenImportModal,
  onExportExcel,
  onToggleMobileSidebar,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Excel Data Import',
      time: 'Just now',
      desc: 'Import Employees from Excel module online and active.',
    },
    {
      id: 2,
      title: 'Automated Invoice Generated',
      time: '10 mins ago',
      desc: 'Payroll invoice generated for Sarah Al-Mansoor (EMP-1001)',
    },
    {
      id: 3,
      title: 'System Security Audit',
      time: '2 hours ago',
      desc: 'JWT authentication validated for active admin session',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onQuickSearch(searchVal.trim());
    }
  };

  return (
    <header className="h-20 bg-[#070F1E]/80 backdrop-blur-md border-b border-white/8 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Title & Mobile Hamburger Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center border border-white/8 transition-all cursor-pointer"
          title="Open Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <span>Merald Group</span>
            <span>•</span>
            <span className="text-slate-400">{admin?.city || 'Dubai HQ'}</span>
          </div>
          <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight mt-0.5 truncate max-w-[180px] sm:max-w-none">
            {currentPathName}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-64">
          <input
            type="text"
            placeholder="Search Passport or Code..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="glass-input pl-10 pr-4 py-2 text-xs rounded-xl border-white/10 focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <Button onClick={onOpenImportModal} variant="secondary" size="sm" className="hidden sm:inline-flex">
          <Upload className="w-4 h-4 text-emerald-400" /> Import Employees
        </Button>

        <Button onClick={onOpenCreateModal} variant="primary" size="sm" className="hidden sm:inline-flex">
          <UserPlus className="w-4 h-4" /> Add Employee
        </Button>

        <Button onClick={onExportExcel} variant="secondary" size="sm" className="hidden xl:inline-flex">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
        </Button>

        {/* Notifications Drawer */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center relative border border-white/8 transition-all cursor-pointer"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute top-2 right-2 ring-4 ring-[#070F1E]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-[#0F1C2E] border border-white/15 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm text-white">Notifications</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-white/3 hover:bg-white/6 transition-all border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Country Badge */}
        <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/4 border border-white/8 text-xs text-slate-300 font-semibold">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{admin?.country || 'UAE'}</span>
        </div>
      </div>
    </header>
  );
};
