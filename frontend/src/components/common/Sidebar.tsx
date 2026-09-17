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
  X,
} from 'lucide-react';
import type { Admin } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  admin: Admin | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  admin,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'All Employee Records', icon: Users },
    { id: 'create-employee', label: 'Create Employee', icon: UserPlus },
    { id: 'reports', label: 'Invoices & Reports', icon: FileSpreadsheet },
    { id: 'admins', label: 'Admin Management', icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content (Desktop Sticky + Mobile Slide Drawer) */}
      <aside
        className={`h-screen bg-[#091424] border-r border-white/8 flex flex-col justify-between z-50 select-none transition-all duration-300 ${
          mobileOpen
            ? 'fixed top-0 left-0 w-[280px] shadow-2xl'
            : 'hidden lg:flex sticky top-0'
        }`}
        style={{
          width: mobileOpen ? '280px' : collapsed ? '80px' : '280px',
        }}
      >
        <div>
          {/* Top Header Logo */}
          <div className="p-5 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg tracking-wider text-white leading-tight">
                    MERALD<span className="text-emerald-400">GROUP</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                    ENTERPRISE HR
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Close Button / Desktop Collapse Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close Mobile Navigation"
              >
                <X className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white items-center justify-center transition-all cursor-pointer"
                title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-1.5">
            {(!collapsed || mobileOpen) && (
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
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-sky-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/4'
                  }`}
                  title={collapsed && !mobileOpen ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin Profile Footer */}
        <div className="p-4 border-t border-white/8 bg-black/20">
          {!collapsed || mobileOpen ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white text-sm shrink-0 border border-white/20">
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
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-500/12 hover:bg-rose-500/25 text-rose-400 font-semibold text-xs transition-all border border-rose-500/20 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="w-full h-10 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 flex items-center justify-center transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
