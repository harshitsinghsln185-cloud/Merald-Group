import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileSpreadsheet,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import type { Admin } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  admin: Admin | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  admin,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'All Employee Records', icon: Users },
    { id: 'create-employee', label: 'Create Employee', icon: UserPlus },
    { id: 'reports', label: 'Invoices & Reports', icon: FileSpreadsheet },
  ];

  return (
    <aside
      style={{
        width: collapsed ? '80px' : '280px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="h-screen sticky top-0 bg-[#091424] border-r border-[rgba(255,255,255,0.08)] flex flex-col justify-between z-30 select-none"
    >
      <div>
        {/* Top Header Logo */}
        <div className="p-5 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#0EA5E9] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider text-white leading-tight">
                  MERALD<span className="text-[#10B981]">GROUP</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                  ENTERPRISE HR
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-slate-400 hover:text-white flex items-center justify-center transition-all"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1.5">
          {!collapsed && (
            <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Core Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[rgba(16,185,129,0.2)] to-[rgba(14,165,233,0.1)] text-[#10B981] border border-[rgba(16,185,129,0.3)] shadow-[0_4px_20px_rgba(16,185,129,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[rgba(255,255,255,0.04)]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#10B981]' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Profile Footer Card */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.2)]">
        {!collapsed ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center font-bold text-white text-sm shrink-0 border border-[rgba(255,255,255,0.2)]">
                {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate leading-tight">
                  {admin?.name || 'Administrator'}
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> Verified Admin
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[rgba(244,63,94,0.12)] hover:bg-[rgba(244,63,94,0.25)] text-rose-400 font-semibold text-xs transition-all border border-[rgba(244,63,94,0.2)]"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="w-full h-10 rounded-xl bg-[rgba(244,63,94,0.15)] hover:bg-[rgba(244,63,94,0.3)] text-rose-400 flex items-center justify-center transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
